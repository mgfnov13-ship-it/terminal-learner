# Terminal Space

Learn the terminal by actually using it. A browser-based lab that teaches command-line skills
against a simulated computer — nothing you type reaches your real machine.

## Architecture

Terminal Space is one codebase with three deliberately distinct product surfaces:

- **Public website** (`/`, `/tracks`, `/how-it-works`, `/demo`, `/about`, `/help`, `/contact`,
  `/privacy`, `/terms`, `/auth/*`) — the professional, public-facing product site.
  `src/layouts/PublicLayout.tsx`, pages under `src/pages/Public/` and `src/pages/Auth/`.
- **Learning app** (`/app/*`) — the authenticated learner workspace: dashboard, learn, missions,
  progress, achievements, profile, settings. `src/layouts/AppLayout.tsx`, pages under
  `src/pages/{Dashboard,Learn,Missions,Progress,Achievements,Profile,Settings,Help}/`.
- **The Lab** (`/app/lab/*`) — the immersive windowed desktop/terminal experience. `src/App.tsx`
  plus `src/components/{Desktop,Windows,Terminal,Academy,Lab}/`. (The in-Lab lesson/mission panel
  is internally still called "Academy" in code/CSS — deliberately not renamed everywhere, since
  it's a persisted-state field name — but reads "Guide" everywhere a learner sees it.)

The learning engine (virtual filesystem, command parser, tutorial/step engine, XP/achievement
idempotency) lives in `src/engine/` and is framework-agnostic aside from the `OSStore` singleton
that exposes it to React via `useSyncExternalStore` (`src/hooks/useOS.ts`).

## Requirements

- Node 20+
- npm

## Setup

```bash
npm install
cp .env.example .env
```

Terminal Space runs fully without any further setup: with `.env` empty, the app runs in **local
development mode** — progress is saved to this browser's local storage only, and every `/app/*`
route stays reachable so you can keep developing against the learning engine without an account
backend. This local-mode passthrough only applies in `npm run dev`; a production build with an
unconfigured backend shows a configuration-unavailable state on account-dependent routes instead
(see `src/features/auth/RequireAuth.tsx`).

### Connecting a real account backend (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project Settings → API → Project URL** and **anon public key** into `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   Never put the `service_role` key here or anywhere in client code.
3. Apply the schema in `supabase/migrations/` (via the Supabase SQL editor, or the Supabase CLI:
   `supabase db push`).
4. Restart `npm run dev`. Sign-up/sign-in, password reset, and cloud progress sync go live
   immediately — see `src/features/sync/` for how local and cloud progress reconcile, and the
   project's implementation plan for the full migration/reconciliation rules.

### Administrator access

The read-only `/admin` dashboard is available to `mgfnov13@gmail.com` and
`m.obaida2021@gmail.com`. Both the route and Supabase row-level security enforce this allowlist.
Keep email confirmation enabled for these accounts. Apply all pending migrations to the connected
Supabase project before opening the dashboard. For hosted auth, set the Site URL to
`https://terminal-learner.vercel.app` and add that origin to Authentication → URL Configuration →
Redirect URLs, along with `http://localhost:5173/**` for local development.

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build   # tsc --noEmit && vite build
```

## Test

```bash
npm test        # vitest run — currently covers the progress-sync/migration pure logic
```

## Deployment

This is a client-side SPA (Vite). Any static host works; configure it to rewrite all paths to
`index.html` (SPA fallback) so deep links like `/app/lab/files/files-3` work on refresh.
