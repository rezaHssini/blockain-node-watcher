import { IBlockStatsAlertMessages } from "../../block-watcher/interfaces/block-alert-messages.interface";

export interface IBlockWatcher {
  getBlockStatsAlerts: () => Promise<Partial<IBlockStatsAlertMessages>>;
  sendAlerts(alert: Partial<IBlockStatsAlertMessages>): Promise<void>;
}
