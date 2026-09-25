import type {
  CheckAccountResponse,
  Data,
  DeleteNotificationResponse,
  ReceiveNotificationResponse,
  SendMessageResponse,
} from '../types/api'
import type { Credentials } from '../types/messenger'
import { request } from './request'

const API_URL = 'https://api.green-api.com'

export function checkAccount(
  credentials: Credentials,
  phoneNumber: number,
  signal?: AbortSignal,
): Promise<Data<CheckAccountResponse>> {
  return request<CheckAccountResponse>(
    createGreenApiUrl(credentials, 'checkAccount'),
    {
      body: { phoneNumber },
      method: 'POST',
      signal,
    },
  )
}

export function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<Data<DeleteNotificationResponse>> {
  return request<DeleteNotificationResponse>(
    createGreenApiUrl(credentials, 'deleteNotification', String(receiptId)),
    { method: 'DELETE', signal },
  )
}

export function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 5,
  signal?: AbortSignal,
): Promise<Data<ReceiveNotificationResponse>> {
  const url = new URL(createGreenApiUrl(credentials, 'receiveNotification'))
  url.searchParams.set('receiveTimeout', String(receiveTimeout))

  return request<ReceiveNotificationResponse>(url.toString(), { signal })
}

export function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
  signal?: AbortSignal,
): Promise<Data<SendMessageResponse>> {
  return request<SendMessageResponse>(
    createGreenApiUrl(credentials, 'sendMessage'),
    {
      body: { chatId, message },
      method: 'POST',
      signal,
    },
  )
}

function createGreenApiUrl(
  credentials: Credentials,
  method: string,
  suffix?: string,
) {
  const instance = encodeURIComponent(credentials.idInstance)
  const token = encodeURIComponent(credentials.apiTokenInstance)
  const suffixPath = suffix === undefined ? '' : `/${encodeURIComponent(suffix)}`

  return `${API_URL}/waInstance${instance}/${method}/${token}${suffixPath}`
}
