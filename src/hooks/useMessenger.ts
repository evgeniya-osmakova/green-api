import { useEffect, useRef, useState } from 'react'
import { checkAccount } from '../api/greenApi'
import type { Chat, Credentials } from '../types/messenger'
import {
  CHECK_ACCOUNT_ERROR_MESSAGE,
  CREDENTIALS_ERROR_MESSAGE,
  INVALID_PHONE_NUMBER_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  getApiErrorMessage,
  getCheckAccountFailureMessage,
} from '../utils/errors'
import { isCheckAccountFailure } from '../utils/typeGuards'

export function useMessenger() {
  const checkAccountController = useRef<AbortController | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [isChatCreating, setIsChatCreating] = useState(false)

  useEffect(
    () => () => {
      checkAccountController.current?.abort()
    },
    [],
  )

  function clearChatError() {
    setChatError(null)
  }

  function connect(nextCredentials: Credentials) {
    setChat(null)
    setChatError(null)
    setCredentials(nextCredentials)
  }

  async function createChat(phoneNumber: string) {
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber)

    if (!credentials) {
      setChatError(CREDENTIALS_ERROR_MESSAGE)
      return
    }

    if (!isValidInternationalPhoneNumber(normalizedPhoneNumber)) {
      setChatError(INVALID_PHONE_NUMBER_MESSAGE)
      return
    }

    checkAccountController.current?.abort()

    const controller = new AbortController()
    checkAccountController.current = controller
    setChatError(null)
    setIsChatCreating(true)

    const result = await checkAccount(
      credentials,
      Number(normalizedPhoneNumber),
      controller.signal,
    )

    if (checkAccountController.current !== controller) {
      return
    }

    if (result.status === 'error') {
      if (result.error.type !== 'abort') {
        setChatError(
          getApiErrorMessage(result.error, CHECK_ACCOUNT_ERROR_MESSAGE),
        )
      }
    } else if (isCheckAccountFailure(result.data)) {
      setChatError(getCheckAccountFailureMessage(result.data))
    } else if (!result.data.exist || !result.data.chatId) {
      setChatError(NOT_FOUND_ERROR_MESSAGE)
    } else {
      setChat({
        chatId: result.data.chatId,
        phoneNumber: normalizedPhoneNumber,
      })
    }

    if (checkAccountController.current === controller) {
      checkAccountController.current = null
      setIsChatCreating(false)
    }
  }

  function disconnect() {
    checkAccountController.current?.abort()
    checkAccountController.current = null
    setChat(null)
    setChatError(null)
    setCredentials(null)
    setIsChatCreating(false)
  }

  return {
    chat,
    chatError,
    credentials,
    isChatCreating,
    clearChatError,
    connect,
    createChat,
    disconnect,
  }
}

function isValidInternationalPhoneNumber(phoneNumber: string) {
  return /^[1-9]\d{0,14}$/.test(phoneNumber)
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, '')
}
