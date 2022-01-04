import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Config } from "../testing-mocks/queue/config";
import { ConfigCheckerService } from "./config-checker.service";

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
  NOTIFICATIN_MS_URL: "test-url",
  NOTIFICATION_CHANNEL_NAME: "test-channel-name",
  NOTIFICATION_BOT_ICON: "test-bot-icon",
  CONFIRMED_MIN_DISTANCE: "0",
  CONFIRMED_MAX_DISTANCE: "20",
};

describe("ConfigCheckerService", () => {
  let service: ConfigCheckerService;
  Config.data = testData;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ConfigCheckerService,
        { provide: ConfigService, useClass: Config },
      ],
    }).compile();

    service = module.get<ConfigCheckerService>(ConfigCheckerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should check config", () => {
    const spy = jest.spyOn(Config.prototype, "get");
    service.checkServiceAddress();
    expect(spy).toBeCalled();
  });

  it("should check config", () => {
    const spy = jest.spyOn(Config.prototype, "get");
    service.checkBalancerAddress();
    expect(spy).toBeCalled();
  });

  it("should check config", () => {
    const spy = jest.spyOn(Config.prototype, "get");
    service.checkLimits();
    expect(spy).toBeCalled();
  });

  it("should check config", () => {
    const spy = jest.spyOn(Config.prototype, "get");
    service.checkNotification();
    expect(spy).toBeCalled();
  });
});
