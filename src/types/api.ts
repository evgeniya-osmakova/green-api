export type ApiError =
  | { type: 'abort' }
  | { status: number; type: 'http' }
  | { type: 'network' }
  | { type: 'response' }

export type CheckAccountFailureResponse = {
  data?: {
    reason: string
    retryAfter?: number
    status: 'fail'
  }
  reason?: string
  status: false
}

export type CheckAccountResponse =
  | CheckAccountFailureResponse
  | {
      chatId: string
      exist: boolean
      fromCache?: boolean
      phoneNumber?: number
      username?: string
    }

export type Data<T> =
  | { error: ApiError; status: 'error' }
  | { data: T; status: 'success' }

export type DeleteNotificationResponse = {
  reason?: string
  result: boolean
}

export type Notification = {
  body: unknown
  receiptId: number
}

export type ReceiveNotificationResponse = Notification | null

export type RequestOptions = {
  body?: unknown
  method?: 'DELETE' | 'GET' | 'POST'
  signal?: AbortSignal
}

export type SendMessageResponse = {
  idMessage: string
}
