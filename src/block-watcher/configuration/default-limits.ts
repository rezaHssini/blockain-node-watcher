import { IBlockStat } from "../interfaces/block-stat.interface";
import { ILimits } from "../interfaces/limits.interface";

export const defaultLimits: ILimits<IBlockStat> = {
  PENDING_MAX_DISTANCE: 5,
  NEW_MAX_DISTANCE: 5,
  LAST_MAX_DISTANCE: 5,
  FETCHED_MAX_DISTANCE: 5,
  CONFIRMED_MAX_DISTANCE: 5,
};
