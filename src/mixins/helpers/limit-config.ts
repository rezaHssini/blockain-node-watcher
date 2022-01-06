import { ConfigService } from "@nestjs/config";
import { defaultLimits } from "../../block-watcher/configuration/default-limits";
import { LimitsConfiguration } from "../../block-watcher/enums/limit-configuration.enum";
import { IBlockStat } from "../../block-watcher/interfaces/block-stat.interface";
import { ILimits } from "../../block-watcher/interfaces/limits.interface";

export function SetLimits(
  method: LimitsConfiguration,
  config?: ConfigService,
  options?: ILimits<IBlockStat>
): ILimits<IBlockStat> {
  if (method == LimitsConfiguration.ReadFromConfig && !config) {
    if (!config) {
      throw new Error("config is required");
    } else {
      return handleReadFromConfig(config);
    }
  }

  if (method == LimitsConfiguration.UseOptions && !options) {
    if (!options) {
      throw new Error("options is required");
    } else {
      return options;
    }
  }

  return getDefaultLimits();
}
function getDefaultLimits(): ILimits<IBlockStat> {
  return defaultLimits;
}
function handleReadFromConfig(config): ILimits<IBlockStat> {
  const objectSchemas = getDefaultLimits();
  let response: ILimits<IBlockStat>;

  Object.keys(objectSchemas).forEach((key) => {
    response[key] = readFromConfig(config, key);
  });
  return response;
}

function readFromConfig(config: ConfigService, key: string): string {
  return config.get<string>(key);
}
