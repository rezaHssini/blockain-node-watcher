import { HttpService } from "@nestjs/axios";
import { blockStatMaker } from "../../mixins/helpers/block-stat-maker";
import { request } from "../../mixins/helpers/request";
import { IBlockWatcher } from "../../mixins/interfaces/blockchain-watcher.interface";
import { NotificationsService } from "../../notifications/notifications.service";
import { BALANCER_ADDRESS_PATH, SERVICE_ADDRESS_PATH } from "../constants";
import { Chain } from "../enums/chain.enum";
import { IBlockStatsAlertMessages } from "../interfaces/block-alert-messages.interface";
import { IBlockStat } from "../interfaces/block-stat.interface";
import { ILimits } from "../interfaces/limits.interface";

export abstract class BlockWatcherBaseClass implements IBlockWatcher {
  abstract get chain(): Chain;
  abstract get serviceUri(): string;
  abstract get balancerUri(): string;
  abstract get limits(): ILimits<IBlockStat>;

  constructor(
    private readonly http: HttpService,
    private readonly notification: NotificationsService
  ) {}

  async getBlockStatsAlerts(): Promise<Partial<IBlockStatsAlertMessages>> {
    const serviceBlockStat = await this.getServiceBlockStats();
    const balancerBlockStat = await this.getServiceBalancerBlockStats();
    if (!serviceBlockStat || !balancerBlockStat) {
      throw new Error(`Error in fetch ${this.chain} network data`);
    }
    const response = {};
    Object.keys(serviceBlockStat).forEach((key: keyof IBlockStat) => {
      const value = this.difference(
        balancerBlockStat[key],
        serviceBlockStat[key]
      );
      const max = this.getLimit(key);
      response[key] = this.compare(value, max);
    });
    return response;
  }

  async getServiceBlockStats(): Promise<IBlockStat> {
    const url = this.getServiceAddress();
    try {
      return await request(this.http, url);
    } catch (error) {
      await this.notification.send(error?.message);
    }
  }
  async getServiceBalancerBlockStats(): Promise<IBlockStat> {
    const url = this.getServiceBalancerAddress();
    let response;
    try {
      response = await request(this.http, url);
    } catch (error) {
      await this.notification.send(error?.message);
    }
    if (!response) {
      throw new Error(`Error in get ${this.chain} last block`);
    }
    return blockStatMaker(response.lastBlock);
  }

  getServiceAddress(): string {
    return `${
      this.serviceUri
    }/${this.chain.toLowerCase()}${SERVICE_ADDRESS_PATH}`;
  }
  getServiceBalancerAddress(): string {
    return this.balancerUri + BALANCER_ADDRESS_PATH;
  }
  compare(value: number, max: number): string | null {
    if (value > max) {
      return "distance value is bigger than expected. distance : " + value;
    }
    return null;
  }
  difference(a: number, b: number): number {
    return Math.abs(a - b);
  }
  async sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void> {
    if (!alert) {
      return;
    }
    const alerts = Object.keys(alert).map((key) => {
      if (alert[key]?.length > 0) {
        return this.notification.send(`${this.chain} : ${key} ${alert[key]}`);
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
  getLimit(key: string): number {
    return +this.limits[`${key.toUpperCase()}_MAX_DISTANCE`];
  }
}
