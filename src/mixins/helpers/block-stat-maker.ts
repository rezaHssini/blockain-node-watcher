import { IBlockStat } from "../../block-watcher/interfaces/block-stat.interface";

export function blockStatMaker(
  latestBlock: number
): IBlockStat {
  return {
    pending: 0,
    new: 0,
    last: latestBlock,
    fetched: 0,
  };
}
