import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  ariaInvalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  ariaInvalid?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="password-field">
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={ariaInvalid || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={shown ? 'Hide password' : 'Show password'}
        aria-pressed={shown}
        onClick={() => setShown((s) => !s)}
      >
        {shown ? <EyeOff size={16} strokeWidth={1.7} /> : <Eye size={16} strokeWidth={1.7} />}
      </button>
    </div>
  );
}
