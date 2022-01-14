export class BlockWatcherServiceMock {
  async check(key: string): Promise<any> {
    return key;
  }
}
