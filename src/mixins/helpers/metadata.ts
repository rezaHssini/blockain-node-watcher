import "reflect-metadata";

export function instanceHasMetadata(
  instance: any,
  metadataKey: symbol | string
): boolean {
  if (!instance || !instance.constructor) {
    return false;
  }
  return Reflect.hasMetadata(metadataKey, instance.constructor);
}

export function getInstanceMetadataValue(
  instance: any,
  metadataKey: symbol | string
): any {
  if (!instance || !instance.constructor) {
    return undefined;
  }
  return Reflect.getMetadata(metadataKey, instance.constructor);
}

export function sortByMetaData(metadataKey: symbol | string): any {
  return (a: any, b: any): number => {
    const firstValue = getInstanceMetadataValue(a, metadataKey);
    const secondValue = getInstanceMetadataValue(b, metadataKey);
    return firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
  };
}
