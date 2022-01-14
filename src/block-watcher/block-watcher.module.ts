import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { BlockWatcher } from "./block-watcher.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { BLOCK_SCANNER_QUEUE_NAME } from "./constants";
import { BullModule } from "@nestjs/bull";
import { BlockWatcherQueue } from "./block-watcher-queue.service";
import { ServiceExplorerModule } from "../service-explorer/service-explorer.module";
import { DashChainService } from "./chains/dash/dash-chain.service";
import { BtcChainService } from "./chains/btc/btc-chain.service";
import { EthChainService } from "./chains/eth/eth-chain.service";
import { TrxChainService } from "./chains/trx/trx-chain.service";
import { XrpChainService } from "./chains/xrp/xrp-chain.service";
import { DotChainService } from "./chains/dot/dot-chain.service";
import { LtcChainService } from "./chains/ltc/ltc-chain.service";

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
