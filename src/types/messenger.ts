export type Credentials = {
  apiTokenInstance: string
  idInstance: string
}

export type CredentialsFormProps = {
  initialCredentials: Credentials
  onSubmit: (credentials: Credentials) => void
}
