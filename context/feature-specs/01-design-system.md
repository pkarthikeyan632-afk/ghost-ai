# Unit: Desktop Skeleton

Read `AGENTS.md` before starting. Follow `architecture.md`,
`code-standards.md` and `ai-workflow-rules.md`.

## Goal

Create the empty desktop app skeleton in `desktop/`:
Electron + React + TypeScript + Vite + Tailwind. It should
open a secure window that shows a placeholder screen.
No features, no backend connection.

## Before Starting

- Remove the Next.js starter files from the repo root
  (confirmed by owner).
- Do not create anything in `backend/` in this unit.

## Tasks

### 1. Create the Vite + React + TypeScript app

- Location: `desktop/`
- TypeScript strict mode on
- Path alias `@/` → `desktop/src/`

### 2. Add Electron

- Main process: `desktop/electron/main.ts`
- Preload script: `desktop/electron/preload.ts`
- Every window uses:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - `sandbox: true`
- Preload exposes nothing yet (empty, ready for later).
- Do not load any remote URL. In development, load the
  Vite dev server on localhost only; in production, load
  the built files.
- Set a strict Content Security Policy that allows only
  local files (and the local dev server in development).

### 3. Add Tailwind

- Install and configure Tailwind for the Vite app.
- Create `desktop/src/globals.css` with the Tailwind setup.
  No theme tokens yet — those come in the design system unit.

### 4. Add tooling

- ESLint for TypeScript and React
- Vitest with one sample test that passes
- Scripts in `desktop/package.json`:
  - `dev` — runs Vite and Electron together
  - `build` — builds the React app and Electron files
  - `lint` — runs ESLint
  - `test` — runs Vitest

### 5. Placeholder screen

- One screen showing the text "GHOST" centered on the page.
- No other UI.

## Out of Scope

- shadcn/ui, theme tokens, fonts, icons (next unit)
- Starting the backend, session token, any API calls
- App packaging and installers

## Check When Done

- `npm run dev` opens an Electron window showing "GHOST"
- `npm run build`, `npm run lint` and `npm run test` pass
- Window security settings are exactly as listed above
- No remote URLs are loaded; DevTools Network tab shows
  no requests to the internet
- The Next.js starter files are gone
- `progress-tracker.md` is updated