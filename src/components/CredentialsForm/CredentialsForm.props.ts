import type { Credentials } from '../../types/messenger'

export type CredentialsFormProps = {
  initialCredentials: Credentials
  onSubmit: (credentials: Credentials) => void
}
