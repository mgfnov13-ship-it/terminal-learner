/** Private-mode / blocked-storage browsers throw on localStorage access, not just writes. */

const memory = new Map<string, string>();

function storageOrNull(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage || null : null;
  } catch {
    return null;
  }
}

export function safeLocalStorageGet(key: string): string | null {
  try {
    return storageOrNull()?.getItem(key) ?? memory.get(`local:${key}`) ?? null;
  } catch {
    return memory.get(`local:${key}`) ?? null;
  }
}

export function safeLocalStorageSet(key: string, value: string): void {
  try {
    const store = storageOrNull();
    if (store) {
      store.setItem(key, value);
      return;
    }
  } catch {
    /* fall through */
  }
  memory.set(`local:${key}`, value);
}

function sessionOrNull(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage || null : null;
  } catch {
    return null;
  }
}

export function safeSessionStorageGet(key: string): string | null {
  try {
    return sessionOrNull()?.getItem(key) ?? memory.get(`session:${key}`) ?? null;
  } catch {
    return memory.get(`session:${key}`) ?? null;
  }
}

export function safeSessionStorageSet(key: string, value: string): void {
  try {
    const store = sessionOrNull();
    if (store) {
      store.setItem(key, value);
      return;
    }
  } catch {
    /* fall through */
  }
  memory.set(`session:${key}`, value);
}

export function safeSessionStorageRemove(key: string): void {
  try {
    sessionOrNull()?.removeItem(key);
  } catch {
    /* ignore */
  }
  memory.delete(`session:${key}`);
}

export function readStored<T extends string>(key: string, fallback: T, allowed?: readonly T[]): T {
  const value = safeLocalStorageGet(key) as T | null;
  if (value == null) return fallback;
  if (allowed && !allowed.includes(value)) return fallback;
  return value;
}
