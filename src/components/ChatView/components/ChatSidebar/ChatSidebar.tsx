import { Button } from '../../../ui/Button/Button'
import type { ChatSidebarProps } from './ChatSidebar.props'
import styles from './ChatSidebar.module.css'

export function ChatSidebar({ phoneNumber, onDisconnect }: ChatSidebarProps) {
  return (
    <aside className={styles.chatSidebar}>
      <div className={styles.chatSidebar__brand}>
        <p className={styles.chatSidebar__eyebrow}>Telegram</p>
        <p className={styles.chatSidebar__title}>GREEN-API Chat</p>
      </div>

      <div className={styles.chatSidebar__chats}>
        <p className={styles.chatSidebar__sectionTitle}>Чаты</p>
        <div aria-current="page" className={styles.chatSidebar__chat}>
          <span aria-hidden="true" className={styles.chatSidebar__avatar}>
            T
          </span>
          <div className={styles.chatSidebar__identity}>
            <p className={styles.chatSidebar__phone}>+{phoneNumber}</p>
            <p className={styles.chatSidebar__status}>Активный чат</p>
          </div>
        </div>
      </div>

      <Button
        className={styles.chatSidebar__disconnect}
        variant="secondary"
        onClick={onDisconnect}
      >
        Отключиться
      </Button>
    </aside>
  )
}
