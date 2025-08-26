export function logInfo(message: string, ...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${message}`, ...args)
}

export function logError(message: string, ...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${message}`, ...args)
}
