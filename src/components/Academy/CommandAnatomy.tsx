import type { CommandAnatomy as Anatomy } from '../../types/tutorial';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import type { LocalizedText } from '../../lib/i18n';

const ROLE_LABEL: Record<string, LocalizedText> = {
  command: { en: 'command', ar: 'أمر' },
  argument: { en: 'name', ar: 'اسم' },
  source: { en: 'source', ar: 'المصدر' },
  destination: { en: 'destination', ar: 'الوجهة' },
  flag: { en: 'flag', ar: 'خيار' },
  path: { en: 'path', ar: 'مسار' },
};

export function CommandAnatomy({ anatomy }: { anatomy: Anatomy }) {
  const { bi } = usePreferences();
  return (
    <figure
      className="cmd-anatomy"
      aria-label={bi({ en: `Command ${anatomy.line}`, ar: `الأمر ${anatomy.line}` })}
    >
      <div className="cmd-line" aria-hidden lang="en" dir="ltr">
        {anatomy.parts.map((part) => (
          <span key={`${part.role}-${part.text}`} className={`cmd-token is-${part.role}`}>
            {part.text}
          </span>
        ))}
      </div>
      <figcaption className="cmd-roles">
        {anatomy.parts.map((part) => (
          <span key={`role-${part.role}-${part.text}`}>{bi(ROLE_LABEL[part.role] ?? { en: part.role, ar: part.role })}</span>
        ))}
      </figcaption>
    </figure>
  );
}
