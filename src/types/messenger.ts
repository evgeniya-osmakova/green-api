export type Chat = {
  chatId: string
  phoneNumber: string
}

export type ChatHeaderProps = {
  phoneNumber: string
}

export type ChatSidebarProps = {
  phoneNumber: string
  onDisconnect: () => void
}

export type ChatSetupFormProps = {
  error: string | null
  isSubmitting: boolean
  onDisconnect: () => void
  onErrorClear: () => void
  onSubmit: (phoneNumber: string) => void
}

export type ChatViewProps = {
  chat: Chat
  isMessageSending: boolean
  messageError: string | null
  messages: Message[]
  onDisconnect: () => void
  onMessageErrorClear: () => void
  onMessageSubmit: (message: string) => Promise<boolean>
}

export type Credentials = {
  apiTokenInstance: string
  idInstance: string
}

export type CredentialsFormProps = {
  initialCredentials: Credentials
  onSubmit: (credentials: Credentials) => void
}

export type Message = {
  direction: 'incoming' | 'outgoing'
  id: string
  text: string
  timestamp: number
}

export type MessageListProps = {
  messages: Message[]
}

export type MessageComposerProps = {
  error: string | null
  isSubmitting: boolean
  onErrorClear: () => void
  onSubmit: (message: string) => Promise<boolean>
}
