export type Chat = {
  chatId: string
  phoneNumber: string
}

export type ChatSetupFormProps = {
  error: string | null
  isSubmitting: boolean
  onDisconnect: () => void
  onErrorClear: () => void
  onSubmit: (phoneNumber: string) => void
}

export type Credentials = {
  apiTokenInstance: string
  idInstance: string
}

export type CredentialsFormProps = {
  initialCredentials: Credentials
  onSubmit: (credentials: Credentials) => void
}
