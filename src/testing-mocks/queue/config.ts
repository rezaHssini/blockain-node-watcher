export class Config {
  public static data: { [key: string]: string } = {};
  get(key: string, defaultValue?: string): string | undefined {
    return Config.data[key] || defaultValue;
  }
}
