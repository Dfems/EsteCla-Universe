export function logInfo(message: string, ...args: unknown[]): void {
  console.log(`[INFO] ${message}`, ...args)
}

export function logError(message: string, ...args: unknown[]): void {
  console.error(`[ERROR] ${message}`, ...args)
}
