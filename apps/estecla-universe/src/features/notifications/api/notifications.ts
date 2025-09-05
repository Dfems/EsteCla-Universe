import { db, auth } from '@services/firebase'
import { Timestamp } from 'firebase/firestore'
import {
  observeNotifications as observeNotificationsShared,
  listNotificationsPage as listNotificationsPageShared,
  markAllNotificationsRead as markAllNotificationsReadShared,
  markNotificationRead as markNotificationReadShared,
  type NotificationsPage,
} from '@estecla/firebase'
export type { NotificationItem } from '@estecla/firebase'
export function observeNotifications(cb: (count: number) => void) {
  return observeNotificationsShared({ auth, db }, cb)
}

export function listNotificationsPage(
  pageSize = 20,
  cursor?: Timestamp
): Promise<NotificationsPage> {
  return listNotificationsPageShared({ auth, db }, pageSize, cursor)
}

export function markNotificationRead(id: string, value = true) {
  return markNotificationReadShared({ auth, db }, id, value)
}

export function markAllNotificationsRead() {
  return markAllNotificationsReadShared({ auth, db })
}
