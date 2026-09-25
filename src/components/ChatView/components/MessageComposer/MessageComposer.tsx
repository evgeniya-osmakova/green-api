import { Button } from '../../../ui/Button/Button'
import styles from './MessageComposer.module.css'

export function MessageComposer() {
  return (
    <form aria-label="Отправка сообщения" className={styles.messageComposer}>
      <label className={styles.messageComposer__label} htmlFor="message-text">
        Сообщение
      </label>
      <textarea
        className={styles.messageComposer__input}
        disabled
        id="message-text"
        name="message"
        placeholder="Напишите сообщение"
        rows={1}
      />
      <Button disabled type="submit">
        Отправить
      </Button>
    </form>
  )
}
