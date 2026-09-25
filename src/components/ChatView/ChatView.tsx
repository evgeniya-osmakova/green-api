import type { ChatViewProps } from '../../types/messenger'
import { ChatHeader } from './components/ChatHeader/ChatHeader'
import { ChatSidebar } from './components/ChatSidebar/ChatSidebar'
import { MessageComposer } from './components/MessageComposer/MessageComposer'
import { MessageList } from './components/MessageList/MessageList'
import styles from './ChatView.module.css'

export function ChatView({ chat, messages, onDisconnect }: ChatViewProps) {
  return (
    <div className={styles.chatView}>
      <ChatSidebar
        phoneNumber={chat.phoneNumber}
        onDisconnect={onDisconnect}
      />

      <section
        aria-label={`Переписка с +${chat.phoneNumber}`}
        className={styles.chatView__conversation}
      >
        <ChatHeader phoneNumber={chat.phoneNumber} />
        <MessageList messages={messages} />
        <MessageComposer />
      </section>
    </div>
  )
}
