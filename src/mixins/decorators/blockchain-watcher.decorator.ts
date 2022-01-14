import { SetMetadata, Type } from "@nestjs/common";
import { BLOCKCHAIN_WATCHER } from "../constants";
import { IBlockWatcher } from "../interfaces/blockchain-watcher.interface";

export function BlockchainWatcher(
  type: string | string[]
): (target: Type<IBlockWatcher>) => void {
  const typeValue: string[] = Array.isArray(type) ? type : [type];
  return SetMetadata<symbol, string[]>(BLOCKCHAIN_WATCHER, typeValue);
}
