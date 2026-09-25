import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CredentialsFormProps } from '../../types/messenger'
import { Button } from '../ui/Button/Button'
import { TextField } from '../ui/TextField/TextField'
import styles from './CredentialsForm.module.css'

export function CredentialsForm({
  initialCredentials,
  onSubmit,
}: CredentialsFormProps) {
  const [apiTokenInstance, setApiTokenInstance] = useState(
    initialCredentials.apiTokenInstance,
  )
  const [idInstance, setIdInstance] = useState(initialCredentials.idInstance)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const credentials = {
      apiTokenInstance: apiTokenInstance.trim(),
      idInstance: idInstance.trim(),
    }

    if (!credentials.apiTokenInstance || !credentials.idInstance) {
      return
    }

    onSubmit(credentials)
  }

  return (
    <form
      autoComplete="off"
      className={styles.credentialsForm}
      onSubmit={handleSubmit}
    >
      <TextField
        autoCapitalize="none"
        autoComplete="off"
        id="id-instance"
        inputMode="numeric"
        label="idInstance"
        name="idInstance"
        required
        spellCheck={false}
        type="text"
        value={idInstance}
        onChange={(event) => setIdInstance(event.target.value)}
      />

      <TextField
        autoCapitalize="none"
        autoComplete="off"
        hint="Токен не сохраняется в браузере."
        id="api-token-instance"
        label="apiTokenInstance"
        name="apiTokenInstance"
        required
        spellCheck={false}
        type="password"
        value={apiTokenInstance}
        onChange={(event) => setApiTokenInstance(event.target.value)}
      />

      <Button type="submit">Продолжить</Button>
    </form>
  )
}
