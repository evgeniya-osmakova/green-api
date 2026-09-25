// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Notification } from '../types/api'
import type { NotificationPollingOptions } from '../types/messenger'
import { useMessenger } from './useMessenger'

const apiMocks = vi.hoisted(() => ({
  checkAccount: vi.fn(),
  sendMessage: vi.fn(),
}))
const pollingMocks = vi.hoisted(() => ({
  useNotificationPolling:
    vi.fn<(options: NotificationPollingOptions) => void>(),
}))

vi.mock('../api/greenApi', () => apiMocks)
vi.mock('./useNotificationPolling', () => pollingMocks)

const credentials = {
  apiTokenInstance: 'token',
  idInstance: 'instance',
}

describe('useMessenger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMocks.checkAccount.mockResolvedValue({
      data: { chatId: '10000000', exist: true },
      status: 'success',
    })
    apiMocks.sendMessage.mockResolvedValue({
      data: { idMessage: 'sent-1' },
      status: 'success',
    })
  })

  it('создаёт чат и сохраняет нормализованное отправленное сообщение', async () => {
    const { result } = renderHook(() => useMessenger())

    act(() => result.current.connect(credentials))

    await act(async () => {
      await result.current.createChat('+49 151 23456789')
    })

    expect(apiMocks.checkAccount).toHaveBeenCalledWith(
      credentials,
      49_151_234_567_89,
      expect.any(AbortSignal),
    )
    expect(result.current.chat).toEqual({
      chatId: '10000000',
      phoneNumber: '4915123456789',
    })

    await act(async () => {
      await result.current.sendMessage('  Сообщение  ')
    })

    expect(apiMocks.sendMessage).toHaveBeenCalledWith(
      credentials,
      '10000000',
      'Сообщение',
      expect.any(AbortSignal),
    )
    expect(result.current.messages).toEqual([
      expect.objectContaining({
        direction: 'outgoing',
        id: 'sent-1',
        text: 'Сообщение',
      }),
    ])
  })

  it('не добавляет повторное входящее сообщение', async () => {
    const { result } = renderHook(() => useMessenger())

    act(() => result.current.connect(credentials))

    await act(async () => {
      await result.current.createChat('+49 151 23456789')
    })

    const pollingOptions = pollingMocks.useNotificationPolling.mock.lastCall?.[0]
    const notification: Notification = {
      body: {
        idMessage: 'incoming-1',
        instanceData: { typeInstance: 'telegram' },
        messageData: {
          textMessageData: { textMessage: 'Входящее сообщение' },
          typeMessage: 'textMessage',
        },
        senderData: { chatId: '10000000' },
        timestamp: 1_700_000_000,
        typeWebhook: 'incomingMessageReceived',
      },
      receiptId: 1,
    }

    expect(pollingOptions).toBeDefined()

    act(() => pollingOptions?.onNotification(notification))

    expect(result.current.messages).toHaveLength(1)

    act(() => pollingOptions?.onNotification(notification))

    expect(result.current.messages).toHaveLength(1)
  })
})
