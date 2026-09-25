import type {
  CheckAccountFailureResponse,
  CheckAccountResponse,
} from '../types/api'

export function isCheckAccountFailure(
  response: CheckAccountResponse,
): response is CheckAccountFailureResponse {
  return 'status' in response && response.status === false
}
