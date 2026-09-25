// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNotificationPolling } from './useNotificationPolling'

const apiMocks = vi.hoisted(() => ({
  deleteNotification: vi.fn(),
  receiveNotification: vi.fn(),
}))

vi.mock('../api/greenApi', () => apiMocks)

describe('useNotificationPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    apiMocks.receiveNotification.mockResolvedValue({
      error: { type: 'network' },
      status: 'error',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('прерывает retry delay при cleanup', async () => {
    const { unmount } = renderHook(() =>
      useNotificationPolling({
        chatId: '10000000',
        credentials: {
          apiTokenInstance: 'token',
          idInstance: 'instance',
        },
        onNotification: vi.fn(),
      }),
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(apiMocks.receiveNotification).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(apiMocks.receiveNotification).toHaveBeenCalledOnce()
  })
})
