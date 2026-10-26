# UI Context

## Theme

Calm, private, focused. GHOST should feel like a quiet
tool on your own desk, not a flashy web app.

- Dark mode is the default; light mode is fully supported.
  Follows the OS setting unless the owner picks one.
- Near-black layered surfaces in dark mode, soft off-white
  in light mode.
- One accent color (teal) for interactive elements only.
- Status is always visible: the owner can see at a glance
  whether the model is running, and when anything goes
  online.
- Everything is bundled locally. No fonts, icons or assets
  are loaded from the internet.

## Colors

All components must use these tokens — no hardcoded
hex values. Tokens are defined on `:root` and switched
by a `data-theme` attribute.

| Role              | CSS Variable        | Dark      | Light     |
| ----------------- | ------------------- | --------- | --------- |
| Page background   | `--bg-base`         | `#0B0D10` | `#F7F8FA` |
| Surface           | `--bg-surface`      | `#14171C` | `#FFFFFF` |
| Raised surface    | `--bg-raised`       | `#1C2027` | `#F0F2F5` |
| Primary text      | `--text-primary`    | `#E6E8EB` | `#111418` |
| Muted text        | `--text-muted`      | `#9BA3AE` | `#5B6470` |
| Primary accent    | `--accent-primary`  | `#5EEAD4` | `#0F766E` |
| Text on accent    | `--accent-contrast` | `#0B0D10` | `#FFFFFF` |
| Border            | `--border-default`  | `#262B33` | `#E2E5EA` |
| Error             | `--state-error`     | `#F87171` | `#B91C1C` |
| Success           | `--state-success`   | `#4ADE80` | `#15803D` |
| Warning           | `--state-warning`   | `#FBBF24` | `#B45309` |

Rules:
- Accent is for actions and focus only, not decoration.
- Errors and warnings always include text or an icon,
  never color alone.
- Text must meet WCAG AA contrast on its background.

## Typography

| Role      | Font           | Variable      |
| --------- | -------------- | ------------- |
| UI text   | Inter          | `--font-sans` |
| Code/mono | JetBrains Mono | `--font-mono` |

- Fonts are installed with `@fontsource` and bundled in
  the app. Never loaded from Google Fonts or any CDN.
- Base size 15px for chat text, 13px for metadata and
  status.
- Numbers from calc, units and weather use `--font-mono`
  so they are easy to read and copy.

## Border Radius

| Context              | Class        |
| -------------------- | ------------ |
| Inline / small UI    | `rounded-md` |
| Chat messages, cards | `rounded-lg` |
| Modals / overlays    | `rounded-xl` |

## Component Library

shadcn/ui on top of Tailwind (built on Radix for
accessibility). Generated components live in
`desktop/src/components/ui/`. Use the CLI to add new
components rather than writing from scratch. Do not edit
generated components directly — wrap them in
`desktop/src/components/` instead.

## Layout Patterns

- **Main window:** three parts top to bottom: top bar,
  chat area, input bar. Optional left sidebar.
- **Top bar:** app name on the left; status indicators on
  the right (model status, backend status, network
  indicator). Bottom border separator.
- **Network indicator:** shows "Local" when idle; briefly
  shows "Online · <domain>" whenever a capability reaches
  the internet. The owner should always know when data
  leaves the machine.
- **Chat area:** centered column, max width ~760px. Owner
  messages on the right, GHOST replies on the left. Scrolls
  independently.
- **Reply label:** every GHOST reply shows a small tag for
  what handled it (e.g. "Chat", "Calculator",
  "Units", "News · source", "Weather · Open-Meteo").
- **Errors:** shown inline in the chat as a clear card with
  a short message and a "Try again" action. Never a silent
  failure, never a raw stack trace.
- **Input bar:** fixed at the bottom. Text field, send
  button, and (Goal 3) a mic button. Enter to send,
  Shift+Enter for a new line.
- **Left sidebar (optional, collapsible):** clear history,
  settings link. Fixed width (~240px) with border separator.
- **Settings screen:** sections for Model, Capabilities
  (on/off toggles, default off), Profile (each field shows
  its sensitivity tag), News feeds, and Data (history
  limit, clear history).
- **Modals:** centered overlay with dimmed backdrop. Used
  only for confirmations (e.g. clear history).
- **Startup screen:** shown while checking backend and
  Ollama. If something is missing, says exactly what and
  how to fix it.

## Icons

Lucide React. Stroke-based icons only. Bundled with the
app.

- `h-4 w-4` for inline and status icons
- `h-5 w-5` for buttons
- Icon-only buttons must have an accessible label
  (`aria-label`) and a tooltip