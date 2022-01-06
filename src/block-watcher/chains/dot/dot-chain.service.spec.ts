import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Config } from "../../../testing-mocks/config";
import { HttpServiceMock } from "../../../testing-mocks/http/http-service.mock";
import { NotificationsServiceMock } from "../../../testing-mocks/notifications/notifications.service.mock";
import { DotChainService } from "./dot-chain.service";

describe("DotChainService", () => {
  let service: DotChainService;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        DotChainService,
        { provide: ConfigService, useClass: Config },
        { provide: NotificationsService, useClass: NotificationsServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
      ],
    }).compile();

    service = module.get<DotChainService>(DotChainService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("should return alerts empty", async () => {
    jest.spyOn(service, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );

    jest.spyOn(service, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      pending: null,
      last: null,
      confirmed: null,
      fetched: null,
      new: null,
    });
  });

  it("should return alert", async () => {
    jest.spyOn(service, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );

    jest.spyOn(service, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 10,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      pending: null,
      last: "distance value is bigger than expected. distance : 40",
      confirmed: null,
      fetched: null,
      new: null,
    });
  });

  it("should return alert", async () => {
    jest.spyOn(service, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );

    jest.spyOn(service, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      pending: "distance value is bigger than expected. distance : 20",
      last: null,
      confirmed: null,
      fetched: null,
      new: null,
    });
  });

  it("should return alert", async () => {
    jest.spyOn(service, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 20,
        fetched: 0,
        new: 0,
      })
    );

    jest.spyOn(service, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      pending: null,
      last: null,
      confirmed: "distance value is bigger than expected. distance : 20",
      fetched: null,
      new: null,
    });
  });

  it("should return alert", async () => {
    jest.spyOn(service, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 20,
        new: 0,
      })
    );

    jest.spyOn(service, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      pending: null,
      last: null,
      confirmed: null,
      fetched: "distance value is bigger than expected. distance : 20",
      new: null,
    });
  });

  it("should return alert", async () => {
    jest.spyOn(service, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 20,
      })
    );

    jest.spyOn(service, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    const result = await service.getBlockStatsAlerts();
    expect(result).toStrictEqual({
      pending: null,
      last: null,
      confirmed: null,
      fetched: null,
      new: "distance value is bigger than expected. distance : 20",
    });
  });
});
