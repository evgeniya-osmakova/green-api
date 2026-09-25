import type { ButtonProps } from '../../../types/ui'
import styles from './Button.module.css'

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  const variantClass =
    variant === 'primary'
      ? styles['button--primary']
      : styles['button--secondary']

  return (
    <button
      {...buttonProps}
      className={`${styles.button} ${variantClass}`}
      type={type}
    >
      {children}
    </button>
  )
}
