import { Global, Module } from "@nestjs/common";
import { SentryService } from "@ntegral/nestjs-sentry";

@Module({
  providers: [SentryService],
  exports: [SentryService],
})
@Global()
export class SentryLoggerModule {}
