# ATELIER — Terminal Space design memory

## Register
product
Terminal Space is now two deliberately distinct surfaces sharing one brand and one token system:
- **Public website** (`/`, `/tracks`, `/how-it-works`, `/demo`, `/about`, `/help`, `/contact`, `/privacy`, `/terms`, `/auth/*`) — a professional product site. Public nav/footer, no game chrome.
- **Learning app** (`/app/*`) — the authenticated workspace: dashboard, learn, missions, progress, achievements, profile, settings. Its own nav (`AppLayout`/`AppNav`), distinct from the public site's terminal-prompt nav.
- **The Lab** (`/app/lab/*`) — the immersive windowed desktop/terminal experience, reached only from inside the app. This is where the "no marketing landing page" register below still fully applies: the desktop, windows, terminal, explorer, and Guide (formerly "Academy") are one product surface, unchanged.

Keeping the Lab's aesthetic special depends on the public site and app shell staying restrained by comparison — see Principles.

## Users
Beginners who need Windows Terminal without risking a real machine. They sit at a desk or on a phone, follow one mission at a time, and want to see files appear when a command works.

## Purpose
Teach file and folder commands by operating a simulated computer. Success: the user creates, lists, enters, renames, copies, moves, and deletes items, and File Explorer shows the same tree.

## Personality
plain, exact, dry
Speak like a lab instructor. Name the file. Name the folder. Do not pep-talk. Do not sell.

## Anti-references
- Inter + teal SaaS dashboards
- purple-to-blue gradient heroes
- phosphor-green hacker terminals on pure black
- pixel-perfect Windows 11 mica chrome
- three equal feature cards
- "Oops!" / "Unleash" / "Your journey begins" product copy
- emoji as icons
- numbered section kickers (01 · THE TOUR)

## Principles
- Inside the Lab: the desktop is the product. The Guide is a brief on that desk, not a website wrapped around a demo.
- Outside the Lab (public site, app shell): professional and restrained on purpose — no simulated desktop windows, no OS chrome, no XP language leaking into marketing copy. This contrast is what makes entering the Lab feel like something happened.
- One source of truth: the virtual file system. Terminal writes it. Explorer reads it. It is device-local — account progress (XP, completion, achievements) is cloud-backed once signed in, but the live simulated disk never claims to follow you to another device.
- Copy names the thing that happened and what to do next.
- Motion reports state (window open, XP gained). It does not decorate.

## Interactivity
Responsive
Window drag, focus, minimize, maximize. Terminal input. Explorer navigation. No scroll choreography. No WebGL.

## Motion policy
- CSS only. No Motion, GSAP, or Lottie.
- Animate transform and opacity. Durations: 120ms press, 220ms chrome, 420ms window enter.
- Easing: --ease-out enter, --ease-in exit, --ease-in-out toggles. No bounce.
- Reduced motion: opacity crossfade ≤150ms, no spatial travel.

## Glassmorphism policy
Window chrome and the taskbar may use backdrop-filter over the wallpaper only. blur() ≤ 12px. Never glass a card sitting on a flat panel. Never glass the terminal body.

## Accessibility
WCAG 2.2 AA. Contrast checked on tokens (ink on navy, ink on tungsten). Visible :focus-visible rings. 44px minimum on taskbar and desktop icons. Keyboard: terminal shortcuts, Esc closes menus, windows are reachable from the taskbar. prefers-reduced-motion respected.

## Creative direction
- **World:** production
- **Aesthetic:** Night Lab — a training computer after hours. Cool navy field, one tungsten lamp.
- **Concept + signature moment:** You are sitting at a virtual desk. Signature: amber block cursor in the terminal, and a clipped briefing slip on the desktop that states the current objective in one sentence.
- **Palette mood:** dark, cool neutrals tinted 252°, single warm accent at hue 68 (tungsten). Not black. Not acid green.
- **Type voice:** Oxanium for academy and boot titles (HUD). Chivo for chrome. Chivo Mono for the terminal. Roman headings. No italic display.
- **Motion budget:** restrained. Window mount, toast, XP chip. No ambient loops.
- **Layout archetype:** Workbench. Taskbar is the nav. Desktop is the canvas. Apps are tools. Academy is the brief.
- **Signature interaction:** type a command → VFS changes → Explorer updates in the same tick.
- **Do / Don't:** Do keep window chrome original (hairline, 6px radius, tungsten focus ring). Don't reproduce Microsoft caption buttons or Segoe UI. The public site does have a landing-page hero now (product website, not the Lab) — keep it typographic and restrained, not a simulated desktop window.

## Tokens
See `tokens.css`. Semantic names only in components.

## Copy rules
- Buttons: verb + object ("Start Academy", "Empty Recycle Bin", "Reset virtual computer").
- Errors: what happened, then how to fix. Terminal errors may mimic cmd phrasing because that is the lesson.
- Empty: "This folder is empty." / "Recycle Bin is empty." / "No achievements yet. Finish a mission to earn the first one."
- Banned: Oops, Unleash, Seamless, Supercharge, journey, dive in, click here.
