import { Injectable } from "@nestjs/common";
import { BLOCKCHAIN_WATCHER } from "../mixins/constants";
import { getInstanceMetadataValue } from "../mixins/helpers/metadata";
import { IBlockWatcher } from "../mixins/interfaces/blockchain-watcher.interface";
import { ServiceExplorerService } from "../service-explorer/service-explorer.service";
import { Chain } from "./enums/chain.enum";

@Injectable()
export class BlockWatcher {
  private watchers: IBlockWatcher[];
  constructor(private readonly serviceExplorer: ServiceExplorerService) {}
  async check(chain: string): Promise<void> {
    const watcher = this.getWatcher(chain);
    const alerts = await watcher.getBlockStatsAlerts();
    await watcher.sendAlerts(alerts);
  }

  protected getWatcher(chain): IBlockWatcher {
    if (!this.watchers) {
      this.watchers =
        this.serviceExplorer.filterWithMetadataKey(BLOCKCHAIN_WATCHER);
    }
    const watchers = this.watchers.filter((scanner) =>
      this.filterServicesByMetaData(chain, scanner)
    );
    if (!watchers || !watchers.length) {
      throw new Error(`Unknown chain ${chain}`);
    }

    return watchers[0];
  }
  protected filterServicesByMetaData(
    chain: string,
    instance: IBlockWatcher
  ): any {
    return getInstanceMetadataValue(instance, BLOCKCHAIN_WATCHER).includes(
      chain
    );
  }
}
