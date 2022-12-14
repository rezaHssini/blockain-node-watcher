// tslint:disable
import { getQueueToken } from "@nestjs/bull";
import { DiscoveryModule } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { QueueMock } from "../testing-mocks/queue/queue.mock";
import { JobProcess } from "./decorators/job-process";
import { QueueProcessor } from "./decorators/queue-processor";
import { ScheduleRepeated } from "./decorators/schedule-repeated";
import { QueueManagerModule } from "./queue-manager.module";
import { QueueManagerService } from "./queue-manager.service";

const TEST_QUEUE_NAME = "TEST_QUEUE";

@QueueProcessor(TEST_QUEUE_NAME)
export class TestQueue {
  @ScheduleRepeated("testSchedule", 10)
  testSchedule(): void {
    return;
  }

  @JobProcess("testProcess")
  testProcess(): void {
    return;
  }
}

class Locker {
  async lock(): Promise<string> {
    return "";
  }
  async unlock(): Promise<void> {
    return;
  }
}

describe("QueueManagerService", () => {
  let service: QueueManagerService;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule, QueueManagerModule.register(new Locker())],
      providers: [TestQueue],
    })
      .overrideProvider(getQueueToken(TEST_QUEUE_NAME))
      .useClass(QueueMock)
      .compile();

    service = module.get<QueueManagerService>(QueueManagerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should add testSchedule and processSchedule", async () => {
    const queueAddFn = jest.spyOn(QueueMock.prototype, "process");
    service.onModuleInit();
    expect(queueAddFn).toBeCalledTimes(2);
  });
});
