import type {
  CheckAccountFailureResponse,
  CheckAccountResponse,
} from '../types/api'

export function isCheckAccountFailure(
  response: CheckAccountResponse,
): response is CheckAccountFailureResponse {
  return 'status' in response && response.status === false
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
