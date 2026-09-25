import { useEffect } from 'react'
import { deleteNotification, receiveNotification } from '../api/greenApi'
import type { NotificationPollingOptions } from '../types/messenger'

const INITIAL_RETRY_DELAY_MS = 1_000
const MAX_RETRY_DELAY_MS = 8_000
const RECEIVE_TIMEOUT_SECONDS = 5

export function useNotificationPolling({
  chatId,
  credentials,
  onNotification,
}: NotificationPollingOptions) {
  const apiTokenInstance = credentials?.apiTokenInstance ?? null
  const idInstance = credentials?.idInstance ?? null

  useEffect(() => {
    if (!apiTokenInstance || !chatId || !idInstance) {
      return
    }

    const controller = new AbortController()
    const pollingCredentials = { apiTokenInstance, idInstance }
    let isActive = true

    async function pollNotifications() {
      let retryAttempt = 0

      while (isActive && !controller.signal.aborted) {
        const result = await receiveNotification(
          pollingCredentials,
          RECEIVE_TIMEOUT_SECONDS,
          controller.signal,
        )

        if (!isActive) {
          return
        }

        if (result.status === 'error') {
          if (result.error.type === 'abort') {
            return
          }

          await wait(getRetryDelay(retryAttempt), controller.signal)
          retryAttempt += 1
          continue
        }

        retryAttempt = 0

        if (result.data === null) {
          continue
        }

        onNotification(result.data)

        if (!isActive || !(await deleteWithRetry(result.data.receiptId))) {
          return
        }
      }
    }

    async function deleteWithRetry(receiptId: number) {
      let retryAttempt = 0

      while (isActive && !controller.signal.aborted) {
        const result = await deleteNotification(
          pollingCredentials,
          receiptId,
          controller.signal,
        )

        if (!isActive) {
          return false
        }

        if (result.status === 'success') {
          return true
        }

        if (result.error.type === 'abort') {
          return false
        }

        await wait(getRetryDelay(retryAttempt), controller.signal)
        retryAttempt += 1
      }

      return false
    }

    void pollNotifications()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [apiTokenInstance, chatId, idInstance, onNotification])
}

function getRetryDelay(retryAttempt: number) {
  return Math.min(
    INITIAL_RETRY_DELAY_MS * 2 ** retryAttempt,
    MAX_RETRY_DELAY_MS,
  )
}

function wait(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve()
      return
    }

    const timeoutId = setTimeout(finishWaiting, delay)

    signal.addEventListener('abort', finishWaiting, { once: true })

    function finishWaiting() {
      clearTimeout(timeoutId)
      signal.removeEventListener('abort', finishWaiting)
      resolve()
    }
  })
}
