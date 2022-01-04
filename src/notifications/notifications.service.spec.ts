import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpServiceMock } from "../testing-mocks/http/http-service.mock";
import { Config } from "../testing-mocks/queue/config";
import { NotificationsService } from "./notifications.service";

const testData = {
  NOTIFICATIN_MS_URL: "test-url",
  NOTIFICATION_CHANNEL_NAME: "test-channel-name",
  NOTIFICATION_BOT_ICON: "test-bot-icon",
};

describe("NotificationsService", () => {
  let service: NotificationsService;
  Config.data = testData;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        NotificationsService,
        { provide: ConfigService, useClass: Config },
        { provide: HttpService, useClass: HttpServiceMock },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
