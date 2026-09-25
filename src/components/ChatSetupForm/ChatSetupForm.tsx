import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { ChatSetupFormProps } from '../../types/messenger'
import { Button } from '../ui/Button/Button'
import { TextField } from '../ui/TextField/TextField'
import styles from './ChatSetupForm.module.css'

export function ChatSetupForm({
  error,
  isSubmitting,
  onDisconnect,
  onErrorClear,
  onSubmit,
}: ChatSetupFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('')

  function handlePhoneNumberChange(value: string) {
    setPhoneNumber(value)
    onErrorClear()
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(phoneNumber)
  }

  return (
    <form className={styles.chatSetupForm} onSubmit={handleSubmit}>
      <div>
        <h2 className={styles.chatSetupForm__title}>Создать чат</h2>
        <p className={styles.chatSetupForm__description}>
          Укажите номер телефона в международном формате.
        </p>
      </div>

      <TextField
        autoComplete="tel"
        enterKeyHint="done"
        hint="Например, +49 151 23456789"
        id="phone-number"
        inputMode="tel"
        label="Номер телефона"
        name="phoneNumber"
        required
        type="tel"
        value={phoneNumber}
        onChange={(event) => handlePhoneNumberChange(event.target.value)}
      />

      <p
        aria-live="polite"
        className={styles.chatSetupForm__error}
        role={error ? 'alert' : undefined}
      >
        {error ?? ''}
      </p>

      <div className={styles.chatSetupForm__actions}>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Ищем чат…' : 'Создать чат'}
        </Button>
        <Button variant="secondary" onClick={onDisconnect}>
          Отключиться
        </Button>
      </div>
    </form>
  )
}
