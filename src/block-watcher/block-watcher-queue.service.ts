import { CatchErrorWithSentry } from "../mixins/decorators/catch-error-with-sentry";
import { QueueProcessor } from "../queue-manager/decorators/queue-processor";
import { ScheduleRepeated } from "../queue-manager/decorators/schedule-repeated";
import { BlockWatcher } from "./block-watcher.service";
import {
  BLOCK_SCANNER_QUEUE_NAME,
  DEFAULT_BLOCK_SCANNER_INTERVAL_MS,
} from "./constants";
import { Chain } from "./enums/chain.enum";

@QueueProcessor(BLOCK_SCANNER_QUEUE_NAME)
export class BlockWatcherQueue {
  constructor(private readonly blockWatcher: BlockWatcher) {}

  @ScheduleRepeated({
    name: "check-latest-blocks",
    interval:
      +process.env.BLOCK_SCANNER_INTERVAL_MS ||
      DEFAULT_BLOCK_SCANNER_INTERVAL_MS,
  })
  @CatchErrorWithSentry()
  async checkLatestBlocks(): Promise<void> {
    const checkings = Object.keys(Chain).map((key) => {
      return this.blockWatcher.check(key);
    });
    Promise.all(checkings);
  }
}
