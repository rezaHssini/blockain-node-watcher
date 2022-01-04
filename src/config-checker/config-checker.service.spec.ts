import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Config } from "../testing-mocks/queue/config";
import { ConfigCheckerService } from "./config-checker.service";

describe("ConfigCheckerService", () => {
  let service: ConfigCheckerService;
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
});
