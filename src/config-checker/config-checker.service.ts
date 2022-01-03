import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IBlockStat } from "../block-watcher/interfaces/block-stat.interface";
import { COIN_NAME } from "../mixins/constants";
import {
  SERVICE_ADDRESS,
  SERVICE_BALANCER_ADDRESS,
} from "../block-watcher/constants";

type KeysEnum<T> = { [P in keyof Required<T>]: true };
const IBlockStatKeys: KeysEnum<IBlockStat> = {
  pending: true,
  fetched: true,
  last: true,
  new: true,
};

@Injectable()
export class ConfigCheckerService implements OnModuleInit {
  private readonly logger = new Logger("ConfigCheckerService");
  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.checkEveryThing();
  }
  checkEveryThing(): void {
    try {
      this.checkCoinName();
      this.checkServiceAddress();
      this.checkBalancerAddress();
      this.checkLimits();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  checkServiceAddress(): void {
    this.checkConfigParameters(SERVICE_ADDRESS);
  }
  checkBalancerAddress(): void {
    this.checkConfigParameters(SERVICE_BALANCER_ADDRESS);
  }
  checkLimits(): void {
    Object.keys(IBlockStatKeys).forEach((key: keyof IBlockStat) => {
      const normalizedKey = key.toUpperCase();
      this.checkConfigParameters(`${normalizedKey}_MIN_DISTANCE`);
      this.checkConfigParameters(`${normalizedKey}_MAX_DISTANCE`);
    });
  }
  checkCoinName(): void {
    if (COIN_NAME?.length === 0) {
      const error = `COIN_NAME didint set`;
      this.logger.error(error);
      throw new Error(error);
    }
  }
  checkConfirmNumber(): void {
    this.checkConfigParameters(`CONFIRM_BLOCK_AFTER`);
  }
  checkConfigParameters(name: string): void {
    const param = this.config.get(name);
    if (!param?.length) {
      const error = `${name} didint set`;
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
