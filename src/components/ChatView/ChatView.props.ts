import type { Chat, Message } from '../../types/messenger'

export type ChatViewProps = {
  chat: Chat
  isMessageSending: boolean
  messageError: string | null
  messages: Message[]
  onDisconnect: () => void
  onMessageErrorClear: () => void
  onMessageSubmit: (message: string) => Promise<boolean>
}
