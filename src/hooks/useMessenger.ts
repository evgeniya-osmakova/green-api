import { useState } from 'react'
import type { Credentials } from '../types/messenger'

export function useMessenger() {
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  function connect(nextCredentials: Credentials) {
    setCredentials(nextCredentials)
  }

  function disconnect() {
    setCredentials(null)
  }

  return { credentials, connect, disconnect }
}
