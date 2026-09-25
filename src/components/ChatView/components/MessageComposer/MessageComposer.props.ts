export type MessageComposerProps = {
  error: string | null
  isSubmitting: boolean
  onErrorClear: () => void
  onSubmit: (message: string) => Promise<boolean>
}
