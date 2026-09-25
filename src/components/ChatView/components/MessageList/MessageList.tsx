import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import type { MessageListProps } from './MessageList.props'
import styles from './MessageList.module.css'

const timeFormatter = new Intl.DateTimeFormat('ru', {
  hour: '2-digit',
  minute: '2-digit',
})

export function MessageList({ messages }: MessageListProps) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div aria-live="polite" className={styles.messageList__empty}>
        <span aria-hidden="true" className={styles.messageList__emptyIcon}>
          ···
        </span>
        <p className={styles.messageList__emptyTitle}>Сообщений пока нет</p>
        <p className={styles.messageList__emptyText}>Напишите первым.</p>
      </div>
    )
  }

  return (
    <ol
      aria-label="Сообщения"
      aria-live="polite"
      className={styles.messageList}
      ref={listRef}
    >
      {messages.map((message) => (
        <li
          className={classNames(styles.messageList__item, {
            [styles['messageList__item--incoming']]:
              message.direction === 'incoming',
            [styles['messageList__item--outgoing']]:
              message.direction === 'outgoing',
          })}
          key={message.id}
        >
          <p className={styles.messageList__text}>{message.text}</p>
          <time
            className={styles.messageList__time}
            dateTime={new Date(message.timestamp).toISOString()}
          >
            {timeFormatter.format(message.timestamp)}
          </time>
        </li>
      ))}
    </ol>
  )
}
