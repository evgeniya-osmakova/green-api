import classNames from 'classnames'
import styles from './App.module.css'
import { ChatSetupForm } from './components/ChatSetupForm/ChatSetupForm'
import { ChatView } from './components/ChatView/ChatView'
import { CredentialsForm } from './components/CredentialsForm/CredentialsForm'
import { useMessenger } from './hooks/useMessenger'
import type { Credentials } from './types/messenger'

const credentialsPrefill: Credentials = {
  apiTokenInstance: import.meta.env.VITE_API_TOKEN_INSTANCE ?? '',
  idInstance: import.meta.env.VITE_ID_INSTANCE ?? '',
}

function App() {
  const {
    chat,
    chatError,
    credentials,
    isChatCreating,
    messages,
    clearChatError,
    connect,
    createChat,
    disconnect,
  } = useMessenger()

  return (
    <main className={styles.app}>
      <section
        className={classNames(styles.app__panel, {
          [styles['app__panel--chat']]: chat !== null,
        })}
      >
        {chat === null ? (
          <header className={styles.app__header}>
            <p className={styles.app__eyebrow}>Telegram</p>
            <h1 className={styles.app__title}>GREEN-API Chat</h1>
            <p className={styles.app__description}>
              {credentials === null
                ? 'Введите данные инстанса. Они останутся только в памяти текущей вкладки.'
                : 'Найдите пользователя Telegram по номеру телефона.'}
            </p>
          </header>
        ) : null}

        {credentials === null ? (
          <CredentialsForm
            initialCredentials={credentialsPrefill}
            onSubmit={connect}
          />
        ) : chat === null ? (
          <ChatSetupForm
            error={chatError}
            isSubmitting={isChatCreating}
            onDisconnect={disconnect}
            onErrorClear={clearChatError}
            onSubmit={createChat}
          />
        ) : (
          <ChatView
            chat={chat}
            messages={messages}
            onDisconnect={disconnect}
          />
        )}
      </section>
    </main>
  )
}

export default App
