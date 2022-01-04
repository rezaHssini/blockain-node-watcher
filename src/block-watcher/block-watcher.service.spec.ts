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
};

describe("BlockWatcher", () => {
  let service: BlockWatcher;
  Config.data = testData;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
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

  it("should call config to get services url", () => {
    const spy = jest.spyOn(Config.prototype, "get");
    service.checkLatestBlocks();
    expect(spy).toBeCalled();
  });

  it("should return 5", () => {
    const result = service.difference(10, 5);
    expect(result).toBe(5);
  });

  it("should return 5", () => {
    const result = service.difference(5, 10);
    expect(result).toBe(5);
  });

  it("should return null", () => {
    const result = service.compare(15, 10, 20);
    expect(result).toBeNull();
  });

  it('should return "distance value is lower than expected"', () => {
    const result = service.compare(1, 10, 20);
    expect(result).toBe("distance value is lower than expected");
  });

  it('should return "distance value is bigger than expected"', () => {
    const result = service.compare(25, 10, 20);
    expect(result).toBe("distance value is bigger than expected");
  });

  it('should return "distance value is bigger than expected"', () => {
    const result = service.compare(25, 10, 20);
    expect(result).toBe("distance value is bigger than expected");
  });

  it("should return service address", () => {
    const result = service.getServiceAddress();
    expect(result).toBe(testData.SERVICE_ADDRESS + "/eth/block/stats");
  });

  it("should return service balancer address", () => {
    const result = service.getServiceBalancerAddress();
    expect(result).toBe(
      testData.SERVICE_BALANCER_ADDRESS + "/balancer/nodes/max-block-number"
    );
  });

  it("should dont have any error", async () => {
    jest
      .spyOn(service, "getServiceBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 0 })
      );
    jest
      .spyOn(service, "getServiceBalancerBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 0 })
      );

    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      fetched: null,
      last: null,
      new: null,
      pending: null,
    });
  });

  it("should have error", async () => {
    jest
      .spyOn(service, "getServiceBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 40, fetched: 0 })
      );
    jest
      .spyOn(service, "getServiceBalancerBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 0 })
      );

    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      fetched: null,
      last: "distance value is bigger than expected",
      new: null,
      pending: null,
    });
  });

  it("should have error", async () => {
    jest
      .spyOn(service, "getServiceBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 0 })
      );
    jest
      .spyOn(service, "getServiceBalancerBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 30, last: 50, fetched: 0 })
      );

    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      fetched: null,
      last: null,
      new: "distance value is bigger than expected",
      pending: null,
    });
  });

  it("should have error", async () => {
    jest
      .spyOn(service, "getServiceBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 0 })
      );
    jest
      .spyOn(service, "getServiceBalancerBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 30, new: 0, last: 50, fetched: 0 })
      );

    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      fetched: null,
      last: null,
      new: null,
      pending: "distance value is bigger than expected",
    });
  });

  it("should have error", async () => {
    jest
      .spyOn(service, "getServiceBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 0 })
      );
    jest
      .spyOn(service, "getServiceBalancerBlockStats")
      .mockResolvedValue(
        Promise.resolve({ pending: 0, new: 0, last: 50, fetched: 30 })
      );

    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      fetched: "distance value is bigger than expected",
      last: null,
      new: null,
      pending: null,
    });
  });
});
