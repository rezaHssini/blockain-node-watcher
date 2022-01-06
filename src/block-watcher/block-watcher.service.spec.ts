import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsService } from "../notifications/notifications.service";
import { NotificationsServiceMock } from "../testing-mocks/notifications/notifications.service.mock";
import { Config } from "../testing-mocks/queue/config";
import { BlockWatcher } from "./block-watcher.service";
import { QueueMock } from "../testing-mocks/queue/queue.mock";
import { getQueueToken } from "@nestjs/bull";
import { BLOCK_SCANNER_QUEUE_NAME } from "./constants";
import { ServiceExplorerModule } from "../service-explorer/service-explorer.module";

const testData = {
  SERVICE_BALANCER_ADDRESS: "test-balancer-address",
  SERVICE_ADDRESS: "test-service-address",
  LAST_MIN_DISTANCE: "0",
  LAST_MAX_DISTANCE: "1",
  PENDING_MIN_DISTANCE: "0",
  PENDING_MAX_DISTANCE: "15",
  NEW_MIN_DISTANCE: "0",
  NEW_MAX_DISTANCE: "10",
  FETCHED_MIN_DISTANCE: "0",
  FETCHED_MAX_DISTANCE: "20",
  CONFIRMED_MIN_DISTANCE: "0",
  CONFIRMED_MAX_DISTANCE: "20",
};

describe("BlockWatcher", () => {
  let service: BlockWatcher;
  Config.data = testData;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ServiceExplorerModule],
      providers: [
        BlockWatcher,
        { provide: ConfigService, useClass: Config },
        { provide: NotificationsService, useClass: NotificationsServiceMock },
        {
          provide: getQueueToken(BLOCK_SCANNER_QUEUE_NAME),
          useClass: QueueMock,
        },
      ],
    }).compile();

    service = module.get<BlockWatcher>(BlockWatcher);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
