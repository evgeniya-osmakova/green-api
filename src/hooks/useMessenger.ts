import { useEffect, useRef, useState } from 'react'
import { checkAccount, sendMessage as sendMessageRequest } from '../api/greenApi'
import type { Chat, Credentials, Message } from '../types/messenger'
import {
  CHECK_ACCOUNT_ERROR_MESSAGE,
  CREDENTIALS_ERROR_MESSAGE,
  EMPTY_MESSAGE_ERROR_MESSAGE,
  INVALID_PHONE_NUMBER_MESSAGE,
  MESSAGE_TOO_LONG_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  SEND_MESSAGE_ERROR_MESSAGE,
  getApiErrorMessage,
  getCheckAccountFailureMessage,
} from '../utils/errors'
import { isCheckAccountFailure } from '../utils/typeGuards'
import { useNotificationPolling } from './useNotificationPolling'

const MAX_MESSAGE_LENGTH = 4096

export function useMessenger() {
  const checkAccountController = useRef<AbortController | null>(null)
  const sendMessageController = useRef<AbortController | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [isChatCreating, setIsChatCreating] = useState(false)
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useNotificationPolling({
    chatId: chat?.chatId ?? null,
    credentials,
  })

  useEffect(
    () => () => {
      checkAccountController.current?.abort()
      checkAccountController.current = null
      sendMessageController.current?.abort()
      sendMessageController.current = null
    },
    [],
  )

  function clearChatError() {
    setChatError(null)
  }

  function clearMessageError() {
    setMessageError(null)
  }

  function connect(nextCredentials: Credentials) {
    checkAccountController.current?.abort()
    checkAccountController.current = null
    sendMessageController.current?.abort()
    sendMessageController.current = null
    setChat(null)
    setChatError(null)
    setCredentials(nextCredentials)
    setIsChatCreating(false)
    setIsMessageSending(false)
    setMessageError(null)
    setMessages([])
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
      setMessageError(null)
      setMessages([])
    }

    if (checkAccountController.current === controller) {
      checkAccountController.current = null
      setIsChatCreating(false)
    }
  }

  async function sendMessage(message: string) {
    const normalizedMessage = message.trim()

    if (!credentials || !chat) {
      setMessageError(SEND_MESSAGE_ERROR_MESSAGE)
      return false
    }

    if (normalizedMessage.length === 0) {
      setMessageError(EMPTY_MESSAGE_ERROR_MESSAGE)
      return false
    }

    if (normalizedMessage.length > MAX_MESSAGE_LENGTH) {
      setMessageError(MESSAGE_TOO_LONG_ERROR_MESSAGE)
      return false
    }

    if (sendMessageController.current) {
      return false
    }

    const controller = new AbortController()
    sendMessageController.current = controller
    setIsMessageSending(true)
    setMessageError(null)

    const result = await sendMessageRequest(
      credentials,
      chat.chatId,
      normalizedMessage,
      controller.signal,
    )

    if (sendMessageController.current !== controller) {
      return false
    }

    let isSuccessful = false

    if (result.status === 'error') {
      if (result.error.type !== 'abort') {
        setMessageError(
          getApiErrorMessage(result.error, SEND_MESSAGE_ERROR_MESSAGE),
        )
      }
    } else {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          direction: 'outgoing',
          id: result.data.idMessage,
          text: normalizedMessage,
          timestamp: Date.now(),
        },
      ])
      isSuccessful = true
    }

    sendMessageController.current = null
    setIsMessageSending(false)

    return isSuccessful
  }

  function disconnect() {
    checkAccountController.current?.abort()
    checkAccountController.current = null
    sendMessageController.current?.abort()
    sendMessageController.current = null
    setChat(null)
    setChatError(null)
    setCredentials(null)
    setIsChatCreating(false)
    setIsMessageSending(false)
    setMessageError(null)
    setMessages([])
  }

  return {
    chat,
    chatError,
    credentials,
    isChatCreating,
    isMessageSending,
    messageError,
    messages,
    clearChatError,
    clearMessageError,
    connect,
    createChat,
    disconnect,
    sendMessage,
  }
}

function isValidInternationalPhoneNumber(phoneNumber: string) {
  return /^[1-9]\d{0,14}$/.test(phoneNumber)
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, '')
}
