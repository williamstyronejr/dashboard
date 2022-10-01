export function convertSize(fileSize: number) {
  const kiloBytes = fileSize / 1000;
  if (kiloBytes < 1024) {
    return `${kiloBytes.toFixed(2)} KB`;
  } else if (kiloBytes % (1024 * 1024) !== kiloBytes) {
    return `${(kiloBytes / (1024 * 1024)).toFixed(2)} GB`;
  }
  return `${(kiloBytes / 1024).toFixed(2)} MB`;
}

export function capitalizeFirst(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

/**
 * Searchs array of objects for a distinct id.
 * @param arr An array of objects that have a distinct "id" property
 * @param id Id to search for
 * @returns Returns a flag indicating if an object in the array has the id
 */
export function isInArray(arr: Array<any>, id: string | number): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return true;
    }
  }

  return false;
}

export function deleteOrInsert(
  arr: Array<any>,
  obj: { id: string | number }
): Array<any> {
  const filtered = arr.filter((item) => item.id !== obj.id);
  return filtered.length === arr.length ? [...filtered, obj] : filtered;
}
