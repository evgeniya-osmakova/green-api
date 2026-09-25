import classNames from 'classnames'
import type { ButtonProps } from './Button.props'
import styles from './Button.module.css'

export function Button({
  children,
  className,
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
      className={classNames(styles.button, variantClass, className)}
      type={type}
    >
      {children}
    </button>
  )
}
