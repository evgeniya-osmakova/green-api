import type { Notification } from './api'

export type Chat = {
  chatId: string
  phoneNumber: string
}

export type Credentials = {
  apiTokenInstance: string
  idInstance: string
}

export type Message = {
  direction: 'incoming' | 'outgoing'
  id: string
  text: string
  timestamp: number
}

export type NotificationPollingOptions = {
  chatId: string | null
  credentials: Credentials | null
  onNotification: (notification: Notification) => void
}
