import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SetLimits } from "../../../mixins/helpers/limit-config";
import { BlockchainWatcher } from "../../../mixins/decorators/blockchain-watcher.decorator";
import { NotificationsService } from "../../../notifications/notifications.service";
import { BlockWatcherBaseClass } from "../../base-class/watcher-base-class";
import { Chain } from "../../enums/chain.enum";
import { LimitsConfiguration } from "../../enums/limit-configuration.enum";

@Injectable()
@BlockchainWatcher(Chain.BTC)
export class BtcChainService extends BlockWatcherBaseClass {
  chain = Chain.BTC;
  serviceUri = "";
  balancerUri = "";
  limits = null;
  constructor(
    http: HttpService,
    notification: NotificationsService,
    config: ConfigService
  ) {
    super(http, notification);
    this.serviceUri = config.get<string>(
      `${this.chain.toUpperCase()}_SERVICE_ADDRESS`
    );
    this.balancerUri = config.get<string>(
      `${this.chain.toUpperCase()}_BALANCER_ADDRESS`
    );

    this.limits = SetLimits(LimitsConfiguration.ReadFromConfig, config);
  }
}
