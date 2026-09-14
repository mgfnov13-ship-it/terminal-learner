import { COMMANDS } from '../../data/commands';
import { LAB_HELP } from '../../data/pageCopy';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { commandCategory, commandSummary } from '../../lib/localizeContent';

export function HelpApp() {
  const { t, bi, language } = usePreferences();
  const groups = [...new Set(COMMANDS.map((c) => c.category))];
  return (
    <div className="help">
      <p className="lede">{bi(LAB_HELP.lede)}</p>
      {groups.map((group) => (
        <section key={group}>
          <h3>{commandCategory(group, language, group)}</h3>
          <ul>
            {COMMANDS.filter((c) => c.category === group).map((c) => (
              <li key={c.name}>
                <code dir="ltr">{c.usage}</code>
                <span>{commandSummary(c.name, language, c.summary)}</span>
                <em dir="ltr">{c.example}</em>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section>
        <h3>{t('keyboard')}</h3>
        <ul className="keys">
          {LAB_HELP.shortcuts.map(([k, d]) => (
            <li key={k.en}>
              <kbd dir="ltr">{bi(k)}</kbd>
              <span>{bi(d)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>{t('labNotes')}</h3>
        <ul className="tips">
          {LAB_HELP.tips.map((tip) => (
            <li key={tip.en}>{bi(tip)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
