import type { ApiError, CheckAccountFailureResponse } from '../types/api'

export const CHECK_ACCOUNT_ERROR_MESSAGE =
  'Не удалось создать чат. Проверьте номер и credentials, затем попробуйте ещё раз.'
export const CREDENTIALS_ERROR_MESSAGE =
  'Не удалось подключиться. Проверьте idInstance и apiTokenInstance.'
export const INVALID_PHONE_NUMBER_MESSAGE =
  'Введите номер в международном формате: до 15 цифр без начального нуля.'
export const NOT_FOUND_ERROR_MESSAGE =
  'Аккаунт Telegram с таким номером не найден или скрыт настройками приватности.'
export const EMPTY_MESSAGE_ERROR_MESSAGE = 'Введите сообщение.'
export const MESSAGE_TOO_LONG_ERROR_MESSAGE =
  'Сообщение не должно быть длиннее 4096 символов.'
export const SEND_MESSAGE_ERROR_MESSAGE =
  'Не удалось отправить сообщение. Попробуйте ещё раз.'

const INSTANCE_ERROR_MESSAGE =
  'Инстанс не авторизован. Проверьте его состояние в GREEN-API.'
const NETWORK_ERROR_MESSAGE =
  'Не удалось подключиться к GREEN-API. Проверьте соединение и попробуйте ещё раз.'
const RATE_LIMIT_ERROR_MESSAGE =
  'Слишком много запросов. Подождите и попробуйте ещё раз.'
const TELEGRAM_LIMIT_ERROR_MESSAGE =
  'Telegram временно ограничил поиск контактов. Попробуйте через несколько часов.'
const UNKNOWN_ERROR_MESSAGE =
  'Не удалось выполнить запрос. Попробуйте ещё раз.'

export function getApiErrorMessage(
  error: ApiError,
  operationMessage: string,
) {
  if (error.type === 'abort') {
    return ''
  }

  if (error.type === 'network') {
    return NETWORK_ERROR_MESSAGE
  }

  if (error.type === 'response') {
    return UNKNOWN_ERROR_MESSAGE
  }

  if (error.status === 401 || error.status === 403) {
    return CREDENTIALS_ERROR_MESSAGE
  }

  if (error.status === 429) {
    return RATE_LIMIT_ERROR_MESSAGE
  }

  if (error.status === 469) {
    return TELEGRAM_LIMIT_ERROR_MESSAGE
  }

  return operationMessage
}

export function getCheckAccountFailureMessage(
  response: CheckAccountFailureResponse,
) {
  const reason = response.data?.reason ?? response.reason

  if (reason === 'instance is starting or not authorized') {
    return INSTANCE_ERROR_MESSAGE
  }

  if (reason === 'rate_limit_exceeded') {
    return RATE_LIMIT_ERROR_MESSAGE
  }

  if (reason === 'Rate limited by messenger') {
    return TELEGRAM_LIMIT_ERROR_MESSAGE
  }

  if (reason === 'Messenger is temporarily unavailable') {
    return 'Telegram временно недоступен. Попробуйте ещё раз позже.'
  }

  return CHECK_ACCOUNT_ERROR_MESSAGE
}
