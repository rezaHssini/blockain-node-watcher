import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Config } from "../testing-mocks/queue/config";
import { NotificationsService } from "./notifications.service";

describe("NotificationsService", () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        NotificationsService,
        { provide: ConfigService, useClass: Config },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
