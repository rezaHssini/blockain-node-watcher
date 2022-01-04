import { ConfigService } from "@nestjs/config";
import { IBlockStat } from "../../block-watcher/interfaces/block-stat.interface";

export function getLimits(
  config: ConfigService,
  key: keyof IBlockStat
): { min: number; max: number } {
  const normalizedKey = key.toUpperCase();
  return {
    min: +config.get(`${normalizedKey}_MIN_DISTANCE`) || 0,
    max: +config.get(`${normalizedKey}_MAX_DISTANCE`) || 0,
  };
}
