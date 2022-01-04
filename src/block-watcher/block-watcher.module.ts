import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { BlockWatcher } from "./block-watcher.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { BLOCK_SCANNER_QUEUE_NAME } from "./constants";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    NotificationsModule,
    BullModule.registerQueue({ name: BLOCK_SCANNER_QUEUE_NAME }),
  ],
  providers: [BlockWatcher],
})
export class BlockWatcherModule {}
