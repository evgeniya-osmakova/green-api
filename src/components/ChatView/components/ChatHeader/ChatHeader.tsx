import type { ChatHeaderProps } from '../../../../types/messenger'
import styles from './ChatHeader.module.css'

export function ChatHeader({ phoneNumber }: ChatHeaderProps) {
  return (
    <header className={styles.chatHeader}>
      <span aria-hidden="true" className={styles.chatHeader__avatar}>
        T
      </span>
      <div className={styles.chatHeader__identity}>
        <h1 className={styles.chatHeader__title}>+{phoneNumber}</h1>
        <p className={styles.chatHeader__subtitle}>Telegram</p>
      </div>
    </header>
  )
}
