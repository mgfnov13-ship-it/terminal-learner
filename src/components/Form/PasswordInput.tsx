import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  ariaInvalid,
  ariaDescribedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}) {
  const [shown, setShown] = useState(false);
  const { t } = usePreferences();
  return (
    <div className="password-field">
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        dir="ltr"
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={shown ? t('hidePassword') : t('showPassword')}
        aria-pressed={shown}
        onClick={() => setShown((s) => !s)}
      >
        {shown ? <EyeOff size={16} strokeWidth={1.7} aria-hidden /> : <Eye size={16} strokeWidth={1.7} aria-hidden />}
      </button>
    </div>
  );
}
