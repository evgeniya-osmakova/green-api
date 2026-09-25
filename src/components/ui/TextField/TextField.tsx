import type { TextFieldProps } from '../../../types/ui'
import styles from './TextField.module.css'

export function TextField({ hint, id, label, ...inputProps }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className={styles.textField}>
      <label className={styles.textField__label} htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p className={styles.textField__hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      <input
        {...inputProps}
        aria-describedby={hintId}
        className={styles.textField__input}
        id={id}
      />
    </div>
  )
}
