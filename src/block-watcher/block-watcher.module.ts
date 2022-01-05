import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { BlockWatcher } from "./block-watcher.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { BLOCK_SCANNER_QUEUE_NAME } from "./constants";
import { BullModule } from "@nestjs/bull";
import { BlockWatcherQueue } from "./block-watcher-queue.service";
import { ServiceExplorerModule } from "../service-explorer/service-explorer.module";
import { DashChainService } from "./chains/dash-chain.service";
import { BtcChainService } from "./chains/btc-chain.service";
import { EthChainService } from "./chains/eth-chain.service";
import { TrxChainService } from "./chains/trx-chain.service";
import { XrpChainService } from "./chains/xrp-chain.service";
import { DotChainService } from "./chains/dot-chain.service";
import { LtcChainService } from "./chains/ltc-chain.service";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    NotificationsModule,
    ServiceExplorerModule,
    BullModule.registerQueue({ name: BLOCK_SCANNER_QUEUE_NAME }),
  ],
  providers: [
    BlockWatcher,
    BlockWatcherQueue,
    DashChainService,
    BtcChainService,
    EthChainService,
    TrxChainService,
    XrpChainService,
    DotChainService,
    LtcChainService,
  ],
})
export class BlockWatcherModule {}
