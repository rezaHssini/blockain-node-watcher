import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsService } from "../notifications/notifications.service";
import { NotificationsServiceMock } from "../testing-mocks/notifications/notifications.service.mock";
import { Config } from "../testing-mocks/queue/config";
import { BlockWatcher } from "./block-watcher.service";

describe("BlockWatcher", () => {
  let service: BlockWatcher;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        BlockWatcher,
        { provide: ConfigService, useClass: Config },
        { provide: NotificationsService, useClass: NotificationsServiceMock },
      ],
    }).compile();

    service = module.get<BlockWatcher>(BlockWatcher);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
