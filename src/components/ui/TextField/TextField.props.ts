import type { InputHTMLAttributes } from 'react'

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id'
> & {
  hint?: string
  id: string
  label: string
}
