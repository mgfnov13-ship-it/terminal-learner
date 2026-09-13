import { COMMANDS } from '../../data/commands';

const SHORTCUTS = [
  ['Ctrl + L', 'Clear the terminal screen'],
  ['Arrow Up / Down', 'Step through command history'],
  ['Tab', 'Complete a command or file name'],
  ['Ctrl + C', 'Clear the current input line'],
  ['Esc', 'Close Start, menus, and dialogs'],
];

const TIPS = [
  'Lessons watch the disk, not your keystrokes. If the folder exists, it counts.',
  'dir and ls both list a folder. Use whichever you remember.',
  'rmdir refuses a folder that still has files. Empty it, or use rmdir /s.',
  'Deleted Explorer items sit in Recycle Bin until you empty it.',
];

export function HelpApp() {
  const groups = [...new Set(COMMANDS.map((c) => c.category))];
  return (
    <div className="help">
      <p className="lede">Commands run inside this browser. None of them reach your real machine.</p>
      {groups.map((group) => (
        <section key={group}>
          <h3>{group}</h3>
          <ul>
            {COMMANDS.filter((c) => c.category === group).map((c) => (
              <li key={c.name}>
                <code>{c.usage}</code>
                <span>{c.summary}</span>
                <em>{c.example}</em>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section>
        <h3>Keyboard</h3>
        <ul className="keys">
          {SHORTCUTS.map(([k, d]) => (
            <li key={k}>
              <kbd>{k}</kbd>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Lab notes</h3>
        <ul className="tips">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
