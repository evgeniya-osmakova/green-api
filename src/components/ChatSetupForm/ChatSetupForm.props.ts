export type ChatSetupFormProps = {
  error: string | null
  isSubmitting: boolean
  onDisconnect: () => void
  onErrorClear: () => void
  onSubmit: (phoneNumber: string) => void
}
