import type { Credentials } from '../../types/messenger'

export type CredentialsFormProps = {
  onSubmit: (credentials: Credentials) => void
}
