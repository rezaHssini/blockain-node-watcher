import { Test, TestingModule } from "@nestjs/testing";
import { BlockWatcher } from "./block-watcher.service";
import { QueueMock } from "../testing-mocks/queue/queue.mock";
import { getQueueToken } from "@nestjs/bull";
import { BLOCK_SCANNER_QUEUE_NAME } from "./constants";
import { BlockWatcherQueue } from "./block-watcher-queue.service";
import { BlockWatcherServiceMock } from "../testing-mocks/block-watcher/block-watcher.service.mock";

describe("BlockWatcherQueue", () => {
  let service: BlockWatcherQueue;
  beforeEach(async () => {
    jest.clearAllTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        BlockWatcherQueue,
        { provide: BlockWatcher, useClass: BlockWatcherServiceMock },
        {
          provide: getQueueToken(BLOCK_SCANNER_QUEUE_NAME),
          useClass: QueueMock,
        },
      ],
    }).compile();

    service = module.get<BlockWatcherQueue>(BlockWatcherQueue);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it('should call "check"', async () => {
    const spy = jest.spyOn(BlockWatcherServiceMock.prototype, "check");
    await service.checkLatestBlocks();
    expect(spy).toBeCalledTimes(7);
  });
});
