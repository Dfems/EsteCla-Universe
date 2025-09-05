export type SWStatus =
  | 'unsupported'
  | 'unregistered'
  | 'registered'
  | 'installing'
  | 'installed'
  | 'activating'
  | 'activated'
  | 'redundant'
export interface RegisterOptions {
  scope?: string
  url?: string
}
export interface UpdateInfo {
  updated: boolean
  needRefresh: boolean
}
export declare function registerSW(
  options?: RegisterOptions
): Promise<ServiceWorkerRegistration | null>
export declare function unregisterSW(): Promise<boolean>
export declare function clearCaches(patterns?: (string | RegExp)[]): Promise<number>
export declare function getSWStatus(): Promise<SWStatus>
export declare function listenForUpdates(cb: (info: UpdateInfo) => void): () => void
export declare function promptUpdate(): Promise<void>
