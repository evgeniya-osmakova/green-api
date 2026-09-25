import { useRef, useState } from 'react'
import type {
  ChangeEvent,
  CompositionEvent,
  KeyboardEvent,
  SubmitEvent,
} from 'react'
import type { MessageComposerProps } from '../../../../types/messenger'
import { Button } from '../../../ui/Button/Button'
import styles from './MessageComposer.module.css'

const MAX_MESSAGE_LENGTH = 4096
const SAFARI_COMPOSITION_WINDOW_MS = 50

export function MessageComposer({
  error,
  isSubmitting,
  onErrorClear,
  onSubmit,
}: MessageComposerProps) {
  const lastCompositionEndAt = useRef<number | null>(null)
  const [message, setMessage] = useState('')
  const normalizedMessageLength = message.trim().length

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value)
    onErrorClear()
  }

  function handleCompositionEnd(event: CompositionEvent<HTMLTextAreaElement>) {
    lastCompositionEndAt.current = event.timeStamp
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (isSubmitting || event.key !== 'Enter' || event.shiftKey) {
      return
    }

    event.preventDefault()

    const compositionJustEnded =
      lastCompositionEndAt.current !== null &&
      Math.abs(event.timeStamp - lastCompositionEndAt.current) <
        SAFARI_COMPOSITION_WINDOW_MS

    if (event.nativeEvent.isComposing || compositionJustEnded) {
      return
    }

    event.currentTarget.form?.requestSubmit()
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (await onSubmit(message)) {
      setMessage('')
    }
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Отправка сообщения"
      className={styles.messageComposer}
      onSubmit={handleSubmit}
    >
      <div className={styles.messageComposer__field}>
        <label className={styles.messageComposer__label} htmlFor="message-text">
          Сообщение
        </label>
        <textarea
          aria-describedby="message-meta"
          aria-invalid={error ? 'true' : undefined}
          className={styles.messageComposer__input}
          enterKeyHint="send"
          id="message-text"
          name="message"
          placeholder="Напишите сообщение"
          readOnly={isSubmitting}
          rows={1}
          value={message}
          onChange={handleChange}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.messageComposer__meta} id="message-meta">
          <p
            aria-live="polite"
            className={styles.messageComposer__error}
            role={error ? 'alert' : undefined}
          >
            {error ?? ''}
          </p>
          <span className={styles.messageComposer__counter}>
            {normalizedMessageLength}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Отправляем…' : 'Отправить'}
      </Button>
    </form>
  )
}
