// Based on https://github.com/nestjs/bull/blob/master/lib/bull.explorer.ts
import {
  getQueueToken,
  BullModuleOptions,
  BullQueueEventOptions,
  ProcessOptions,
} from "@nestjs/bull";
import { Inject, Injectable, Logger, OnModuleInit, Type } from "@nestjs/common";
import { createContextId, DiscoveryService, ModuleRef } from "@nestjs/core";
import { Injector } from "@nestjs/core/injector/injector";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { Module } from "@nestjs/core/injector/module";
import { MetadataScanner } from "@nestjs/core/metadata-scanner";
import { Job, JobOptions, ProcessCallbackFunction, Queue } from "bull";
import { CatchErrorWithSentry } from "../mixins/decorators/catch-error-with-sentry";
import {
  JOB_LOCKER,
  JOB_PROCESS_META,
  QUEUE_MANAGER_PROCESSOR,
  REPEATED_TASK_META,
} from "./constants";
import { JobLocker } from "./interfaces/job-locker";
import { QueueManagerScheduleOptions } from "./interfaces/queue-manager-schedule-options";

type AnyFn = (...args: any[]) => any;

@Injectable()
export class QueueManagerService implements OnModuleInit {
  private readonly injector = new Injector();
  private readonly logger = new Logger("QueueManagerService");
  constructor(
    private discoveryService: DiscoveryService,
    private readonly moduleRef: ModuleRef,
    private readonly metadataScanner: MetadataScanner,
    @Inject(JOB_LOCKER) private readonly jobLocker: JobLocker
  ) {}
  onModuleInit(): void {
    this.explore();
  }
  explore(): void {
    const providers: InstanceWrapper[] = this.discoveryService
      .getProviders()
      .filter(
        (wrapper: InstanceWrapper) =>
          wrapper.metatype && this.getQueueConfig(wrapper.metatype as AnyFn)
      );
    providers.forEach((wrapper) => this.handleQueueProcessor(wrapper));
  }

  handleQueueProcessor(wrapper: InstanceWrapper): void {
    const { metatype } = wrapper;
    const isRequestScoped = !wrapper.isDependencyTreeStatic();
    const queueName = this.getQueueName(metatype as AnyFn);
    const queueToken = getQueueToken(queueName);
    const bullQueue = this.getQueue(queueToken);
    this.metadataScanner.scanFromPrototype(
      wrapper.instance,
      Object.getPrototypeOf(wrapper.instance),
      (key: string) =>
        this.addProcessor(wrapper, key, bullQueue, isRequestScoped)
    );
  }

  @CatchErrorWithSentry()
  addProcessor(
    wrapper: InstanceWrapper,
    key,
    queue: Queue,
    isRequestScoped: boolean
  ): void {
    const module = wrapper.host;
    const instance = wrapper.instance;
    if (this.isScheduledProcess(instance, key)) {
      const options = this.getScheduleOptions(instance, key);
      this.handleScheduledProcessor(
        instance,
        key,
        queue,
        module,
        isRequestScoped,
        options
      );
    } else if (this.isProcessHandler(instance, key)) {
      const options = this.getProcessOptions(instance, key);
      this.handleProcessor(
        instance,
        key,
        queue,
        module,
        isRequestScoped,
        options
      );
    }
  }
  isScheduledProcess(instance: object, key: string): boolean {
    return !!this.getScheduleOptions(instance, key);
  }

  isProcessHandler(instance: object, key: string): boolean {
    return !!this.getProcessOptions(instance, key);
  }

  getQueueConfig(
    providerConstructor: AnyFn | Type<any>
  ): BullModuleOptions | undefined {
    return Reflect.getMetadata(QUEUE_MANAGER_PROCESSOR, providerConstructor);
  }

  getQueueName(providerConstructor: AnyFn | Type<any>): string | undefined {
    const config = this.getQueueConfig(providerConstructor);
    return config && typeof config === "string" ? config : config.name;
  }

  getQueue(queueToken: string): Queue {
    try {
      return this.moduleRef.get<Queue>(queueToken, { strict: false });
    } catch (err) {
      throw err;
    }
  }

  getProcessOptions(target: object, key: string): ProcessOptions | undefined {
    return Reflect.getMetadata(JOB_PROCESS_META, target, key);
  }

  getScheduleOptions(
    target: object,
    key: string
  ): QueueManagerScheduleOptions | undefined {
    return Reflect.getMetadata(REPEATED_TASK_META, target, key);
  }

  handleProcessor(
    instance: object,
    key: string,
    queue: Queue,
    moduleRef: Module,
    isRequestScoped: boolean,
    options?: ProcessOptions
  ): void {
    const callback = this.getProcessCallback(
      instance,
      key,
      moduleRef,
      isRequestScoped
    );
    this.addProcessorToQueue(queue, callback, options);
  }

  handleScheduledProcessor(
    instance: object,
    key: string,
    queue: Queue,
    moduleRef: Module,
    isRequestScoped: boolean,
    options: QueueManagerScheduleOptions
  ): void {
    const callback = this.getScheduledProcessCallback(
      instance,
      key,
      moduleRef,
      isRequestScoped,
      queue.name,
      options.expirationTime
    );
    this.addProcessorToQueue(queue, callback, options);
    this.scheduleRepeated(queue, options.name, options.interval).catch((err) =>
      this.logger.error(err)
    );
  }

  handleListener(
    instance: object,
    key: string,
    wrapper: InstanceWrapper,
    queue: Queue,
    options: BullQueueEventOptions
  ): void {
    if (!wrapper.isDependencyTreeStatic()) {
      this.logger.warn(
        `Warning! "${wrapper.name}" class is request-scoped and it defines an event listener ("${wrapper.name}#${key}"). Since event listeners cannot be registered on scoped providers, this handler will be ignored.`
      );
      return;
    }
    const callback = this.getQueueListenerCallback(
      instance,
      key,
      queue,
      options
    );
    queue.on(options.eventName, callback);
  }

  getQueueListenerCallback(
    instance: object,
    key: string,
    queue: Queue,
    options?: BullQueueEventOptions
  ): (...args) => Promise<unknown> {
    if (!options.name && !options.id) {
      return instance[key].bind(instance);
    }
    return async (jobOrJobId: Job | string, ...args: unknown[]) => {
      const job =
        typeof jobOrJobId === "string"
          ? (await queue.getJob(jobOrJobId)) || { name: false, id: false }
          : jobOrJobId;

      if (job.name === options.name || job.id === options.id) {
        return instance[key].apply(instance, [job, ...args]);
      }
    };
  }

  addProcessorToQueue(
    queue: Queue,
    callback: AnyFn,
    options?: ProcessOptions
  ): void {
    let args: unknown[] = [options?.name, options?.concurrency, callback];
    args = args.filter((item) => item !== undefined);
    queue.process.call(queue, ...args);
  }

  getScheduledProcessCallback(
    instance: object,
    key: string,
    moduleRef: Module,
    isRequestScoped: boolean,
    queueName: string,
    expireIn: number
  ): (...args) => Promise<unknown> {
    const callback = this.getProcessCallback(
      instance,
      key,
      moduleRef,
      isRequestScoped
    );
    return async (...args: unknown[]) => {
      let result;
      let error;
      const lockId = await this.jobLocker.lock(queueName, key, expireIn);
      if (!lockId) {
        return;
      }
      try {
        result = await callback(...args);
      } catch (e) {
        error = e;
      } finally {
        await this.jobLocker.unlock(queueName, key, lockId);
      }
      if (error) {
        throw error;
      }
      return result;
    };
  }

  getProcessCallback(
    instance: object,
    key: string,
    moduleRef: Module,
    isRequestScoped: boolean
  ): (...args: unknown[]) => void {
    if (!isRequestScoped) {
      return instance[key].bind(instance) as ProcessCallbackFunction<unknown>;
    }

    return async (...args: unknown[]) =>
      this.requestScopedProcessCallback(instance, key, moduleRef, ...args);
  }

  private async requestScopedProcessCallback(
    instance: object,
    key: string,
    moduleRef: Module,
    ...args: unknown[]
  ): Promise<unknown> {
    const contextId = createContextId();

    if (this.moduleRef.registerRequestByContextId) {
      // Additional condition to prevent breaking changes in
      // applications that use @nestjs/bull older than v7.4.0.
      const jobRef = args[0];
      this.moduleRef.registerRequestByContextId(jobRef, contextId);
    }

    const contextInstance = await this.injector.loadPerContext(
      instance,
      moduleRef,
      moduleRef.providers,
      contextId
    );
    return contextInstance[key].call(contextInstance, ...args);
  }
  async scheduleRepeated(
    queue: Queue,
    name: string,
    interval: number,
    unique = true
  ): Promise<void> {
    const opts: JobOptions = {
      repeat: { every: interval },
      removeOnComplete: true,
      removeOnFail: true,
    };
    if (unique) {
      opts.jobId = `queue-test-${name}`;
    }
    await queue.add(name, {}, opts);
  }

  async cleanJobsInQueue(queueName: string): Promise<void> {
    const queueToken = getQueueToken(queueName);
    const bullQueue = this.getQueue(queueToken);
    await bullQueue.clean(10);
  }

  async clearJobsInAllQueues(): Promise<void> {
    const providers: InstanceWrapper[] = this.discoveryService
      .getProviders()
      .filter(
        (wrapper: InstanceWrapper) =>
          wrapper.metatype && this.getQueueConfig(wrapper.metatype as AnyFn)
      );
    await Promise.all(providers.map((w) => this.handleQueueCleaner(w)));
  }

  private async handleQueueCleaner(wrapper: InstanceWrapper): Promise<void> {
    const { metatype } = wrapper;
    const queueName = this.getQueueName(metatype as AnyFn);
    const queueToken = getQueueToken(queueName);
    const bullQueue = this.getQueue(queueToken);
    await bullQueue.clean(10);
  }
}
