import { Module } from "@nestjs/common";
import { JobLockerService } from "./job-locker.service";

@Module({
  imports: [],
  providers: [JobLockerService],
  exports: [JobLockerService],
})
export class JobLockerModule {}
