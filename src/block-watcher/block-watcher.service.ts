import { Job } from "bull";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { CatchErrorWithSentry } from "../mixins/decorators/catch-error-with-sentry";
import { QueueProcessor } from "../queue-manager/decorators/queue-processor";
import { ScheduleRepeated } from "../queue-manager/decorators/schedule-repeated";
import { IBlockStat } from "./interfaces/block-stat.interface";
import { NotificationsService } from "../notifications/notifications.service";
import { request } from "../mixins/helpers/request";
import { blockStatMaker } from "../mixins/helpers/block-stat-maker";
import { COIN_NAME } from "../mixins/constants";
import { getLimits } from "../mixins/helpers/get-limits";
import {
  BALANCER_ADDRESS_PATH,
  BLOCK_SCANNER_QUEUE_NAME,
  DEFAULT_BLOCK_SCANNER_INTERVAL_MS,
  SERVICE_ADDRESS,
  SERVICE_ADDRESS_PATH,
  SERVICE_BALANCER_ADDRESS,
} from "./constants";

type IBlockStatsAlertMessages = Record<keyof IBlockStat, string>;

@QueueProcessor(BLOCK_SCANNER_QUEUE_NAME)
export class BlockWatcher {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly notification: NotificationsService
  ) {}

  @ScheduleRepeated({
    name: "check-latest-blocks",
    interval:
      +process.env.BLOCK_SCANNER_INTERVAL_MS ||
      DEFAULT_BLOCK_SCANNER_INTERVAL_MS,
  })
  @CatchErrorWithSentry()
  async checkLatestBlocks(job: Job<object>): Promise<void> {
    const alert = await this.getBlockStatsAlerts();
    await this.sendAlerts(alert);
  }

  private async getBlockStatsAlerts(): Promise<
    Partial<IBlockStatsAlertMessages>
  > {
    const serviceBlockStat = await this.getServiceBlockStats();
    const balancerBlockStat = await this.getServiceBalancerBlockStats();
    var response = {};
    Object.keys(serviceBlockStat).forEach((key: keyof IBlockStat) => {
      const value = this.difference(
        balancerBlockStat[key],
        serviceBlockStat[key]
      );
      const { min, max } = getLimits(this.config, key);
      response[key] = this.compare(value, min, max);
    });
    return response;
  }

  private async getServiceBlockStats(): Promise<IBlockStat> {
    const url = this.getServiceAddress();
    return await request(this.http, url);
  }
  private async getServiceBalancerBlockStats(): Promise<IBlockStat> {
    const url = this.getServiceBalancerAddress();
    const response = await request(this.http, url);
    return blockStatMaker(response.lastBlock);
  }

  private getServiceAddress(): string {
    return `${this.config.get(
      SERVICE_ADDRESS
    )}/${COIN_NAME}${SERVICE_ADDRESS_PATH}`;
  }
  private getServiceBalancerAddress(): string {
    return this.config.get(SERVICE_BALANCER_ADDRESS) + BALANCER_ADDRESS_PATH;
  }
  private compare(value: number, min: number, max: number): string | null {
    if (value < min) {
      return "distance value is lower than expected";
    }
    if (value > max) {
      return "distance value is bigger than expected";
    }
    return null;
  }
  private difference(a: number, b: number): number {
    return Math.abs(a - b);
  }
  private async sendAlerts(
    alert: Partial<IBlockStatsAlertMessages>
  ): Promise<void> {
    console.log(alert);
    if (!alert) {
      return;
    }
    const alerts = Object.keys(alert).map((key) => {
      if (alert[key]?.length > 0) {
        return this.notification.send(`${COIN_NAME} : ${key} ${alert[key]}`);
      }
    });
    if (alerts.length === 0) {
      return;
    }
    try {
      await Promise.all(alerts);
    } catch (err) {
      throw new Error(`failed to send notification. ${err}`);
    }
  }
}
