import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
} from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id'
> & {
  hint?: string
  id: string
  label: string
}
