import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SentryModule } from "@ntegral/nestjs-sentry";
import { AppController } from "./app.controller";
import { BullModule } from "@nestjs/bull";
import { QueueManagerModule } from "./queue-manager/queue-manager.module";
import { SentryLoggerModule } from "./sentry-logger/sentry-logger.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { BlockWatcherModule } from "./block-watcher/block-watcher.module";
import { JobLockerService } from "./job-locker/job-locker.service";
import { JobLockerModule } from "./job-locker/job-locker.module";
import { ServiceExplorerModule } from "./service-explorer/service-explorer.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : ".env",
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => ({
        redis: {
          host: config.get("REDIS_HOST"),
          port: +config.get("REDIS_PORT"),
        },
      }),
      inject: [ConfigService],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dsn: configService.get("SENTRY_DSN"),
        debug: configService.get("SENTRY_DEBUG") === "true",
        environment: configService.get("SENTRY_ENVIRONMENT"),
        logLevel: +configService.get("SENTRY_LOGLEVEL") || 1,
        tracesSampleRate: +configService.get("SENTRY_TRACE_SAMPLE_RATE") || 1.0,
      }),
      inject: [ConfigService],
    }),
    QueueManagerModule.register(JobLockerService, JobLockerModule),
    SentryLoggerModule,
    NotificationsModule,
    BlockWatcherModule,
    ServiceExplorerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
