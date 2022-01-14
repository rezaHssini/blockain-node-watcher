import { BullModule } from "@nestjs/bull";
import { DynamicModule, Module, Type } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { JOB_LOCKER } from "./constants";
import { JobLocker } from "./interfaces/job-locker";
import { QueueManagerService } from "./queue-manager.service";
import { queuesList } from "./queues-list";

@Module({
  providers: [QueueManagerService],
})
export class QueueManagerModule {
  static register(locker: JobLocker): DynamicModule;
  static register(locker: Type<JobLocker>, module: Type<any>): DynamicModule;
  static register(
    locker: JobLocker | Type<JobLocker>,
    module?: Type<any>
  ): DynamicModule {
    const queues = queuesList.map((opts) => BullModule.registerQueue(opts));
    const result = {
      module: QueueManagerModule,
      imports: [...queues, DiscoveryModule],
      providers: [],
      exports: [...queues],
    };

    if (typeof locker === "function" && typeof module === "function") {
      result.imports.push(module);
      result.providers.push({
        provide: JOB_LOCKER,
        useFactory: (lockerInstance: JobLocker) => lockerInstance,
        inject: [locker],
      });
    } else if (
      locker &&
      (locker as JobLocker).lock &&
      (locker as JobLocker).unlock
    ) {
      result.providers.push({ provide: JOB_LOCKER, useValue: locker });
    } else {
      throw new Error(
        "QueueManagerModule.register takes either locker object either locker service with corresponding module."
      );
    }

    return result;
  }
}
