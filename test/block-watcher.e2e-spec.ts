import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { NotificationsService } from "./../src/notifications/notifications.service";
import { NotificationsServiceMock } from "./../src/testing-mocks/notifications/notifications.service.mock";
import { QueueManagerService } from "./../src/queue-manager/queue-manager.service";
import { BlockWatcher } from "./../src/block-watcher/block-watcher.service";

describe("Block Watcher service (e2e)", () => {
  let app: INestApplication;
  let queueManager: QueueManagerService;
  let blockWatcher: BlockWatcher;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NotificationsService)
      .useClass(NotificationsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    queueManager = app.get<QueueManagerService>(QueueManagerService);
    blockWatcher = app.get<BlockWatcher>(BlockWatcher);
    await queueManager.clearJobsInAllQueues();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it('should call "getServiceBlockStats"', (done) => {
    const spyOnService = jest.spyOn(blockWatcher, "getServiceBlockStats");
    setTimeout(() => {
      expect(spyOnService).toBeCalled();
      done();
    }, 8000);
    jest.advanceTimersByTime(8000);
  }, 10000);

  it('should call "getServiceBalancerBlockStats"', (done) => {
    const spyOnService = jest.spyOn(
      blockWatcher,
      "getServiceBalancerBlockStats"
    );
    setTimeout(() => {
      expect(spyOnService).toBeCalled();
      done();
    }, 8000);
    jest.advanceTimersByTime(8000);
  }, 10000);

  it("should call send notification", (done) => {
    const spyOnService = jest.spyOn(NotificationsServiceMock.prototype, "send");
    jest.spyOn(blockWatcher, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 25,
        new: 50,
        last: 123456789,
        fetched: 30,
        confirmed: 20,
      })
    );
    jest.spyOn(blockWatcher, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        new: 0,
        last: 123456788,
        fetched: 0,
        confirmed: 0,
      })
    );
    setTimeout(() => {
      expect(spyOnService).toBeCalledWith(
        "eth : pending distance value is bigger than expected"
      );
      done();
    }, 8000);
    jest.advanceTimersByTime(8000);
  }, 10000);
});
