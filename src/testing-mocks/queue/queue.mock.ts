import { getQueueToken } from "@nestjs/bull";
import { Provider } from "@nestjs/common";
import { Job, Queue } from "bull";

export class QueueMock implements Partial<Queue> {
  async process(...args: any[]): Promise<any> {
    return args;
  }
  async add(): Promise<Job> {
    return {} as unknown as Job;
  }
  async getActive(): Promise<Job[]> {
    return [];
  }
  async getWaiting(): Promise<Job[]> {
    return [];
  }
  async empty(): Promise<void> {
    return;
  }

  on(event, callback): Queue<any> {
    callback(event);
    return this as unknown as Queue<any>;
  }
}

export function getQueueMockProvider(name: string): Provider<QueueMock> {
  return {
    provide: getQueueToken(name),
    useClass: QueueMock,
  };
}
