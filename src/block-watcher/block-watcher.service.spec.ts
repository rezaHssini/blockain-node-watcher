import { Test, TestingModule } from "@nestjs/testing";
import { BlockWatcher } from "./block-watcher.service";
import { ServiceExplorerModule } from "../service-explorer/service-explorer.module";
import { Chain } from "./enums/chain.enum";
import { BlockchainWatcher } from "../mixins/decorators/blockchain-watcher.decorator";
import { IBlockStatsAlertMessages } from "./interfaces/block-alert-messages.interface";

@BlockchainWatcher(Chain.ETH)
class EthBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}
@BlockchainWatcher(Chain.BTC)
class BtcBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}
@BlockchainWatcher(Chain.LTC)
class LtcBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}
@BlockchainWatcher(Chain.DASH)
class DashBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}
@BlockchainWatcher(Chain.DOT)
class DotBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}
@BlockchainWatcher(Chain.TRX)
class TrxBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}
@BlockchainWatcher(Chain.XRP)
class XrpBlockWatcherTest {
  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    return {};
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    console.log(alert);
  }
}

describe("BlockWatcher", () => {
  let service: BlockWatcher;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ServiceExplorerModule],
      providers: [
        BlockWatcher,
        EthBlockWatcherTest,
        BtcBlockWatcherTest,
        LtcBlockWatcherTest,
        DashBlockWatcherTest,
        DotBlockWatcherTest,
        TrxBlockWatcherTest,
        XrpBlockWatcherTest,
      ],
    }).compile();

    service = module.get<BlockWatcher>(BlockWatcher);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call eth handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("ETH");
    expect(spy).toBeCalled();
  });

  it("should call btc handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("BTC");
    expect(spy).toBeCalled();
  });

  it("should call trx handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("TRX");
    expect(spy).toBeCalled();
  });

  it("should call dash handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("DASH");
    expect(spy).toBeCalled();
  });

  it("should call dot handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("DOT");
    expect(spy).toBeCalled();
  });

  it("should call ltc handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("LTC");
    expect(spy).toBeCalled();
  });
  it("should call xrp handler", async () => {
    const spy = jest.spyOn(
      EthBlockWatcherTest.prototype,
      "getBlockStatsAlerts"
    );
    await service.check("XRP");
    expect(spy).toBeCalled();
  });
});
