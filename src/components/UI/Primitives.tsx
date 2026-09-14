import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { usePreferences } from '../../features/preferences/PreferencesProvider';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
};

export function DirArrow() {
  return (
    <span className="dir-arrow" aria-hidden>
      →
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', loading = false, children, disabled, className = '', ...props },
  ref,
) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : variant === 'danger'
          ? 'btn-danger'
          : 'btn-ghost';
  return (
    <button
      ref={ref}
      className={`${variantClass} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
});

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
  error?: string;
  success?: string;
};

export function Field({ label, helper, error, success, id, className = '', ...props }: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `field-${generatedId.replace(/:/g, '')}`;
  const helperId = `${fieldId}-helper`;
  const described = Boolean(helper || error || success);
  return (
    <label className={`ts-field ${className}`.trim()} htmlFor={fieldId}>
      <span className="ts-field__label">{label}</span>
      <input
        id={fieldId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={described ? helperId : undefined}
        data-state={error ? 'error' : success ? 'success' : 'idle'}
        {...props}
      />
      <span id={helperId} className="ts-field__helper" data-tone={error ? 'error' : success ? 'success' : 'neutral'}>
        {error || success || helper || '\u00a0'}
      </span>
    </label>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <label className="ts-toggle" htmlFor={id}>
      <span>
        <span className="ts-toggle__label">{label}</span>
        {description ? <small>{description}</small> : null}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function PasswordField({
  label,
  helper,
  error,
  id,
  value,
  onChange,
  autoComplete,
  dir,
}: {
  label: string;
  helper?: string;
  error?: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  dir?: 'ltr' | 'rtl';
}) {
  const { t } = usePreferences();
  const helperId = `${id}-helper`;
  const described = Boolean(helper || error);
  const shownId = `${id}-shown`;
  return (
    <div className="ts-field">
      <label className="ts-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="password-field">
        <input
          id={id}
          type="password"
          value={value}
          autoComplete={autoComplete}
          dir={dir}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={described ? helperId : undefined}
          data-state={error ? 'error' : 'idle'}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={t('showPassword')}
          aria-controls={id}
          aria-pressed="false"
          onClick={(e) => {
            const input = document.getElementById(id) as HTMLInputElement | null;
            if (!input) return;
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            e.currentTarget.setAttribute('aria-pressed', String(show));
            e.currentTarget.setAttribute('aria-label', show ? t('hidePassword') : t('showPassword'));
          }}
        >
          <span id={shownId} aria-hidden>
            ⌁
          </span>
        </button>
      </div>
      <span id={helperId} className="ts-field__helper" data-tone={error ? 'error' : 'neutral'}>
        {error || helper || '\u00a0'}
      </span>
    </div>
  );
}
