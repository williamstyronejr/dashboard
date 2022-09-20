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
