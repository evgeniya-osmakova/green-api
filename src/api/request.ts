import type { Data, RequestOptions } from '../types/api'

export async function request<T>(
  url: string,
  { body, method = 'GET', signal }: RequestOptions = {},
): Promise<Data<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers,
      method,
      signal,
    })
    const responseText = await response.text()

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          type: 'http',
        },
        status: 'error',
      }
    }

    try {
      const data = responseText.length === 0 ? null : JSON.parse(responseText)

      return { data: data as T, status: 'success' }
    } catch {
      return {
        error: {
          type: 'response',
        },
        status: 'error',
      }
    }
  } catch {
    return {
      error: { type: signal?.aborted ? 'abort' : 'network' },
      status: 'error',
    }
  }
}
