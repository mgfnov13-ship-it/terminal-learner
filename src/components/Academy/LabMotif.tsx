/**
 * Decorative summit-and-flag mark for the Academy header. Drawn from tokens so it
 * follows the theme; hidden from assistive tech since the caption carries the meaning.
 */
export function LabMotif({ caption }: { caption: string }) {
  return (
    <figure className="lab-motif">
      <svg viewBox="0 0 132 74" role="img" aria-hidden focusable="false">
        <path className="motif-sky" d="M0 62h132" />
        <path className="motif-far" d="M14 62 46 26l20 22 10-9 22 23z" />
        <path className="motif-near" d="M52 62 84 20l32 42z" />
        <path className="motif-snow" d="M84 20l10 13-7 3-6-4-5 3z" />
        <path className="motif-pole" d="M84 20V6" />
        <path className="motif-flag" d="M84 6h15l-4 5 4 5H84z" />
        <path className="motif-trail" d="M22 62c14-4 18-14 30-16s14 8 26 4" />
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
