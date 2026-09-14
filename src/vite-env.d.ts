/// <reference types="vite/client" />

declare module 'node:fs' {
  export function readFileSync(path: URL | string, encoding: string): string;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
