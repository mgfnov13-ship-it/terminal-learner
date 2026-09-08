export const SEP = '\\';
export const DRIVE = 'C:';
export const HOME = 'C:\\Users\\Student';

export function normalizeSlashes(input: string): string {
  return input.replace(/\//g, SEP);
}

export function splitPath(path: string): string[] {
  const raw = normalizeSlashes(path).replace(/^[\\/]+/, '');
  const parts = raw.split(SEP).filter(Boolean);
  if (parts[0]?.toUpperCase() === 'C:') {
    parts[0] = DRIVE;
  }
  return parts;
}

export function joinPath(parts: string[]): string {
  if (parts.length === 0) return DRIVE + SEP;
  if (parts.length === 1 && parts[0].toUpperCase() === 'C:') return DRIVE + SEP;
  const cleaned = parts.map((p, i) => (i === 0 && p.toUpperCase() === 'C:' ? DRIVE : p));
  return cleaned.join(SEP);
}

export function parentPath(path: string): string {
  const parts = splitPath(path);
  if (parts.length <= 1) return DRIVE + SEP;
  return joinPath(parts.slice(0, -1));
}

export function baseName(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1] ?? DRIVE;
}

export function resolvePath(cwd: string, target?: string): string {
  if (!target || target === '.') return canonicalize(cwd);
  const t = normalizeSlashes(target.trim());
  if (t === '/' || t === SEP || t === 'C:\\' || t.toUpperCase() === 'C:') {
    return DRIVE + SEP;
  }
  const abs = /^[A-Za-z]:/.test(t) || t.startsWith(SEP);
  const start = abs ? (t.startsWith(SEP) ? DRIVE + t : t) : joinRelative(cwd, t);
  return canonicalize(start);
}

function joinRelative(cwd: string, rel: string): string {
  const base = splitPath(cwd);
  const extra = splitPath(rel.startsWith(SEP) ? DRIVE + rel : rel);
  return joinPath([...base, ...extra.filter((p) => p !== DRIVE)]);
}

export function canonicalize(path: string): string {
  const parts = splitPath(path);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      if (stack.length > 1) stack.pop();
      continue;
    }
    stack.push(part);
  }
  if (stack.length === 0) return DRIVE + SEP;
  return joinPath(stack);
}

export function displayPath(path: string): string {
  const canon = canonicalize(path);
  return canon.endsWith(SEP) ? canon : canon;
}

export function samePath(a: string, b: string): boolean {
  return canonicalize(a).toLowerCase() === canonicalize(b).toLowerCase();
}

export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) {
        tokens.push(cur);
        cur = '';
      }
      continue;
    }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

export function splitRedirect(input: string): { body: string; redirect?: string } {
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '>') {
      const body = input.slice(0, i).trim();
      const redirect = input.slice(i + 1).trim().replace(/^>/, '').trim();
      return { body, redirect: redirect || undefined };
    }
  }
  return { body: input.trim() };
}
