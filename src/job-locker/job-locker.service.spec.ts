import { Test, TestingModule } from "@nestjs/testing";
import { SentryService } from "@ntegral/nestjs-sentry";

import { JobLockerService } from "./job-locker.service";

describe("JobLockerService", () => {
  let service: JobLockerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [JobLockerService, SentryService],
    }).compile();

    service = module.get<JobLockerService>(JobLockerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
