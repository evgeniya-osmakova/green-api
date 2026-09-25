import styles from './App.module.css'
import { CredentialsForm } from './components/CredentialsForm/CredentialsForm'
import { Button } from './components/ui/Button/Button'
import { useMessenger } from './hooks/useMessenger'
import type { Credentials } from './types/messenger'

const credentialsPrefill: Credentials = {
  apiTokenInstance: import.meta.env.VITE_API_TOKEN_INSTANCE ?? '',
  idInstance: import.meta.env.VITE_ID_INSTANCE ?? '',
}

function App() {
  const { credentials, connect, disconnect } = useMessenger()

  return (
    <main className={styles.app}>
      <section className={styles.app__panel}>
        <header className={styles.app__header}>
          <p className={styles.app__eyebrow}>Telegram</p>
          <h1 className={styles.app__title}>GREEN-API Chat</h1>
          <p className={styles.app__description}>
            Введите данные инстанса. Они останутся только в памяти текущей
            вкладки.
          </p>
        </header>

        {credentials === null ? (
          <CredentialsForm
            initialCredentials={credentialsPrefill}
            onSubmit={connect}
          />
        ) : (
          <div className={styles.app__connected}>
            <div>
              <h2 className={styles.app__subtitle}>Credentials сохранены</h2>
              <p className={styles.app__instance}>
                Инстанс: {credentials.idInstance}
              </p>
            </div>
            <Button variant="secondary" onClick={disconnect}>
              Отключиться
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
