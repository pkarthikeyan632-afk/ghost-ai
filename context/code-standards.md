# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workarounds
- Do not mix unrelated concerns in one component, route
  or module
- Prefer clear, boring code over clever code
- Fail safely: when unsure, deny, refuse or ask — never guess
- No dead code, commented-out code or unused dependencies
- Every new dependency must have a clear reason, written
  in the commit message

## Python (Backend)

- Python 3.11+, with type hints on every function
- Run `ruff` (lint + format) and `mypy` (strict) — both
  must pass
- Use Pydantic models for all data crossing a boundary
  (API, capability input/output, LLM output, config)
- Never use `eval`, `exec`, `subprocess`, `os.system` or
  `pickle`
- Never import `httpx` or `requests` outside
  `backend/security/network_gate.py`
- Use `async` for I/O (Ollama, network, database);
  keep pure logic (calc, units) as normal functions
- Every external call has a timeout
- Raise specific, named errors (e.g. `ModelUnavailableError`,
  `CapabilityDeniedError`) — never bare `except:` and never
  swallow errors silently
- Use `logging`, not `print`. Never log profile values,
  secrets or tokens

## TypeScript (Desktop)

- Strict mode is required throughout the project
- Avoid `any` — use explicit interfaces or narrowly
  scoped types
- Validate every backend response before using it
  (use `zod`)
- API types must match the backend schemas; keep them in
  one shared file (`desktop/src/api/types.ts`)

## React

- Function components and hooks only
- Components display data and send user actions — no
  business logic
- All backend calls go through one API client
  (`desktop/src/api/client.ts`) that attaches the session token
- Every request shows a clear loading, success and error state
- Keep components under ~150 lines; split if larger

## Electron

- `contextIsolation: true`, `nodeIntegration: false`,
  `sandbox: true` on every window
- Expose only named, minimal functions through the preload
  script — never expose `ipcRenderer` or Node APIs directly
- Do not load remote URLs in the app window
- Set a strict Content Security Policy
- The main process owns starting and stopping the backend
  and must shut it down cleanly on exit

## Styling

- Use Tailwind utility classes; no inline style objects
  except for dynamic values
- Use theme tokens from `tailwind.config` — no hardcoded
  hex colors in components
- Support light and dark mode from the start
- Text and errors must be readable at normal size; no
  meaning shown by color alone

## API Routes

- Validate and parse request input with Pydantic before
  any logic runs
- Check the session token before anything else (done in
  shared middleware, not per route)
- Routes stay thin: validate, call `core`, return the result
- Return one consistent response shape:
  `{ ok: true, data }` or `{ ok: false, error: { code, message } }`
- Error messages are clear to the user and never leak
  internal details, paths or stack traces
- Use stable error codes (e.g. `MODEL_UNAVAILABLE`,
  `CAPABILITY_DENIED`, `UNSUPPORTED_REQUEST`)

## Capabilities

- One folder per capability in `backend/capabilities/<name>/`
- Each capability declares, in one place:
  - its permission name
  - the profile fields it may receive
  - the domains it may contact (empty for local-only)
- Each capability returns a typed result with a clear
  success or failure — never a plain string
- A capability never calls another capability directly;
  only `core` orchestrates

## LLM and Prompts

- All prompts live in `backend/llm/prompts/` as named
  templates — no prompt strings scattered in code
- Prompts never contain security rules that code should
  enforce
- Ask the model for structured output (JSON) when the
  result feeds code, and validate it with Pydantic
- Tests run with a fixed model version and temperature 0

## Data and Storage

- All persistent app data lives in SQLite
- Every schema change goes through an Alembic migration;
  never edit an applied migration
- Secrets live only in the OS keychain
- Non-secret settings live in the config file
- Every profile field has a sensitivity tag
- Conversation history is trimmed to the configured limit
  before being sent to the model

## Testing

- Every unit of work includes its tests in the same step
- `tests/critical/` — must always pass at 100%; never edit
  or remove an existing test without approval
- `tests/unit/` — fast tests for single functions
- `tests/scenarios/` — normal-use suite (95% target) and
  voice test set
- Test behavior, not exact LLM wording (e.g. "routed to
  calc", "refused", "returned error code")
- Mock the network gate and Ollama in unit tests; use the
  real local model only in scenario tests
- Name tests by behavior: `test_calc_request_routes_to_calc`

## File Organization

- `desktop/electron/` — Electron main and preload scripts
- `desktop/src/components/` — React UI components
- `desktop/src/api/` — Backend API client and shared types
- `backend/api/` — FastAPI routes and schemas
- `backend/core/` — Request pipeline
- `backend/router/` — Request classification
- `backend/capabilities/<name>/` — One folder per capability
- `backend/llm/` — Ollama client and prompt templates
- `backend/security/` — Token, authorization, profile
  permissions, network gate
- `backend/db/` — Models and migrations
- `backend/voice/` — Speech-to-text and text-to-speech
  (Goal 3)
- `tests/critical/`, `tests/unit/`, `tests/scenarios/` — Tests
- `docs/` — Context files, data flows, known limitations