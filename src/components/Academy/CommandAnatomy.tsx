import type { CommandAnatomy as Anatomy } from '../../types/tutorial';

const ROLE_LABEL: Record<string, string> = {
  command: 'command',
  argument: 'name',
  source: 'source',
  destination: 'destination',
  flag: 'flag',
  path: 'path',
};

export function CommandAnatomy({ anatomy }: { anatomy: Anatomy }) {
  return (
    <figure className="cmd-anatomy" aria-label={`Command ${anatomy.line}`}>
      <div className="cmd-line" aria-hidden>
        {anatomy.parts.map((part) => (
          <span key={`${part.role}-${part.text}`} className={`cmd-token is-${part.role}`}>
            {part.text}
          </span>
        ))}
      </div>
      <figcaption className="cmd-roles">
        {anatomy.parts.map((part) => (
          <span key={`role-${part.role}-${part.text}`}>{ROLE_LABEL[part.role] ?? part.role}</span>
        ))}
      </figcaption>
    </figure>
  );
}
