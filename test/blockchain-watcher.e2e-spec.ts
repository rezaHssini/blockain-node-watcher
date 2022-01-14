import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { NotificationsService } from "./../src/notifications/notifications.service";
import { BtcChainService } from "./../src/block-watcher/chains/btc/btc-chain.service";
import { TrxChainService } from "./../src/block-watcher/chains/trx/trx-chain.service";
import { LtcChainService } from "./../src/block-watcher/chains/ltc/ltc-chain.service";
import { XrpChainService } from "./../src/block-watcher/chains/xrp/xrp-chain.service";
import { DotChainService } from "./../src/block-watcher/chains/dot/dot-chain.service";
import { EthChainService } from "./../src/block-watcher/chains/eth/eth-chain.service";
import { DashChainService } from "./../src/block-watcher/chains/dash/dash-chain.service";
import { QueueManagerService } from "./../src/queue-manager/queue-manager.service";
import { HttpService } from "@nestjs/axios";
import { HttpServiceMock } from "./../src/testing-mocks/http/http-service.mock";
import { NotificationsServiceMock } from "./../src/testing-mocks/notifications/notifications.service.mock";

describe("BlockWatcher (e2e)", () => {
  let app: INestApplication;
  let queueManager: QueueManagerService;
  let btcHandler: BtcChainService;
  let trxHandler: TrxChainService;
  let ethHandler: EthChainService;
  let dashHandler: DashChainService;
  let dotHandler: DotChainService;
  let ltcHandler: LtcChainService;
  let xrpHandler: XrpChainService;
  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useClass(HttpServiceMock)
      .overrideProvider(NotificationsService)
      .useClass(NotificationsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    queueManager = app.get<QueueManagerService>(QueueManagerService);
    btcHandler = app.get<BtcChainService>(BtcChainService);
    trxHandler = app.get<TrxChainService>(TrxChainService);
    ethHandler = app.get<EthChainService>(EthChainService);
    dotHandler = app.get<DotChainService>(DotChainService);
    ltcHandler = app.get<LtcChainService>(LtcChainService);
    xrpHandler = app.get<XrpChainService>(XrpChainService);
    dashHandler = app.get<DashChainService>(DashChainService);

    jest.spyOn(ethHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(ethHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    jest.spyOn(btcHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(btcHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    jest.spyOn(trxHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(trxHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    jest.spyOn(dotHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(dotHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    jest.spyOn(ltcHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(ltcHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    jest.spyOn(xrpHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(xrpHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );
    jest.spyOn(dashHandler, "getServiceBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 20,
        last: 70,
        confirmed: 20,
        fetched: 20,
        new: 20,
      })
    );
    jest.spyOn(dashHandler, "getServiceBalancerBlockStats").mockResolvedValue(
      Promise.resolve({
        pending: 0,
        last: 50,
        confirmed: 0,
        fetched: 0,
        new: 0,
      })
    );

    queueManager.clearJobsInAllQueues();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it('should call all btc "sendAlert"', (done) => {
    const spy = jest.spyOn(btcHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);

  it('should call all eth "sendAlert"', (done) => {
    const spy = jest.spyOn(ethHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);

  it('should call all trx "sendAlert"', (done) => {
    const spy = jest.spyOn(trxHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);

  it('should call all dash "sendAlert"', (done) => {
    const spy = jest.spyOn(dashHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);

  it('should call all dot "sendAlert"', (done) => {
    const spy = jest.spyOn(dotHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);

  it('should call all ltc "sendAlert"', (done) => {
    const spy = jest.spyOn(ltcHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);

  it('should call all xrp "sendAlert"', (done) => {
    const spy = jest.spyOn(xrpHandler, "sendAlerts");
    setTimeout(() => {
      expect(spy).toBeCalled();
      done();
    }, 10000);
    jest.advanceTimersByTime(10000);
  }, 12000);
});
