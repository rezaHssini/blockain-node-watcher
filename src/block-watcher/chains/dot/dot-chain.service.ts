import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BlockchainWatcher } from "../../../mixins/decorators/blockchain-watcher.decorator";
import { NotificationsService } from "../../../notifications/notifications.service";
import { BlockWatcherBaseClass } from "../../base-class/watcher-base-class";
import { Chain } from "../../enums/chain.enum";

@Injectable()
@BlockchainWatcher(Chain.DOT)
export class DotChainService extends BlockWatcherBaseClass {
  chain = Chain.DOT;
  serviceUri = "";
  balancerUri = "";
  limits = {
    PENDING_MAX_DISTANCE: 5,
    NEW_MAX_DISTANCE: 5,
    LAST_MAX_DISTANCE: 5,
    FETCHED_MAX_DISTANCE: 5,
    CONFIRMED_MAX_DISTANCE: 5,
  };
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
  }
}
