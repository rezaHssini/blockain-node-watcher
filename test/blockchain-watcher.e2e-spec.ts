import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { NotificationsService } from "./../src/notifications/notifications.service";
import { BtcChainService } from "./../src/block-watcher/chains/btc/btc-chain.service";
import { TrxChainService } from "./../src/block-watcher/chains/trx/trx-chain.service";
import { EthChainService } from "./../src/block-watcher/chains/eth/eth-chain.service";
import { LtcChainService } from "./../src/block-watcher/chains/ltc/ltc-chain.service";
import { XrpChainService } from "./../src/block-watcher/chains/xrp/xrp-chain.service";
import { DotChainService } from "./../src/block-watcher/chains/dot/dot-chain.service";
import { DashChainService } from "./../src/block-watcher/chains/dash/dash-chain.service";
import { QueueManagerService } from "./../src/queue-manager/queue-manager.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let notificationService: NotificationsService;
  let queueManager: QueueManagerService;
  let btcHandler: BtcChainService;
  let trxHandler: TrxChainService;
  let ethHandler: EthChainService;
  let dashHandler: DashChainService;
  let dotHandler: DotChainService;
  let ltcHandler: LtcChainService;
  let xrpHandler: XrpChainService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    notificationService = app.get<NotificationsService>(NotificationsService);
    queueManager = app.get<QueueManagerService>(QueueManagerService);
    btcHandler = app.get<BtcChainService>(BtcChainService);
    trxHandler = app.get<TrxChainService>(TrxChainService);
    ethHandler = app.get<EthChainService>(EthChainService);
    dashHandler = app.get<DashChainService>(DashChainService);
    dotHandler = app.get<DotChainService>(DotChainService);
    ltcHandler = app.get<LtcChainService>(LtcChainService);
    xrpHandler = app.get<XrpChainService>(XrpChainService);

    queueManager.clearJobsInAllQueues();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  //   it("/health-check (GET)", () => {});
});
