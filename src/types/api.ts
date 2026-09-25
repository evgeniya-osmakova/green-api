export type ApiError =
  | { type: 'abort' }
  | { status: number; type: 'http' | 'response' }
  | { type: 'network' }

export type CheckAccountResponse =
  | {
      chatId: string
      exist: boolean
      fromCache?: boolean
      phoneNumber?: number
      username?: string
    }
  | {
      data?: {
        reason: string
        retryAfter?: number
        status: 'fail'
      }
      reason?: string
      status: false
    }

export type Data<T> =
  | { status: 'loading' }
  | { error: ApiError; status: 'error' }
  | { data: T; status: 'success' }

export type DeleteNotificationResponse = {
  reason?: string
  result: boolean
}

export type ReceiveNotificationResponse = {
  body: unknown
  receiptId: number
} | null

export type RequestOptions = {
  body?: unknown
  method?: 'DELETE' | 'GET' | 'POST'
  signal?: AbortSignal
}

export type SendMessageResponse = {
  idMessage: string
}
