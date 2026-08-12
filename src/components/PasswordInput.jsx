import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordInput.module.css';

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  autoComplete = 'current-password',
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        type={visivel ? 'text' : 'password'}
        id={id}
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-required={required ? 'true' : undefined}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visivel}
        title={visivel ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {visivel ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
