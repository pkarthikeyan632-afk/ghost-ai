# Architecture Context

## Stack

| Layer            | Technology                          | Role |
| ---------------- | ----------------------------------- | ---- |
| Desktop shell    | Electron                            | Opens the app window, starts and stops the backend, creates the session token |
| UI               | React + TypeScript + Vite           | Shows chat, settings and errors. No business logic |
| Styling          | Tailwind CSS                        | UI styling |
| Backend          | Python 3.11+ + FastAPI + Uvicorn    | Runs the request pipeline and all capabilities |
| Validation       | Pydantic v2                         | Checks every request and response shape |
| Local LLM        | Ollama                              | Runs the language model on this machine |
| Database         | SQLite + SQLAlchemy + Alembic       | Stores history, profile, settings, permissions |
| Units            | pint                                | Unit conversions |
| Calculations     | Own safe math parser (Python `ast`) | Calculations. Never `eval` |
| News             | feedparser                          | Reads configured RSS feeds |
| Weather          | Open-Meteo (behind provider interface) | Weather data. Swappable |
| Outbound HTTP    | httpx (inside network gate only)    | The only way the backend reaches the internet |
| Secrets          | OS keychain (`keyring`)             | API keys, if any provider needs one |
| Speech-to-text   | faster-whisper (Goal 3)             | Local speech recognition |
| Text-to-speech   | Piper (Goal 3)                      | Local voice output |
| Testing          | pytest (backend), Vitest (UI)       | Unit, critical and scenario tests |

## System Boundaries

- `desktop/electron/` — Electron main process. Starts the
  backend, generates the per-launch session token, sets
  window security options. Owns app lifecycle and shutdown.
- `desktop/src/` — React UI. Displays chat, settings and
  errors. Talks only to the local backend API. No business
  logic, no direct internet access.
- `backend/api/` — FastAPI routes and request/response
  schemas. Thin layer: validates and hands off to `core`.
- `backend/core/` — The request pipeline: validate → route →
  select context → authorize → execute → check result →
  build response → update history. Every request goes
  through here.
- `backend/router/` — Decides request type. Fixed rules
  first, LLM classifier only as fallback. Returns
  "unsupported" or "unclear" when it can't decide.
- `backend/capabilities/` — One folder per capability
  (`chat`, `calc`, `units`, `news`, `weather`). Each declares
  its permission name, the profile fields it may use, and
  the domains it may contact.
- `backend/llm/` — Ollama client, prompts, timeouts and
  model availability checks.
- `backend/security/` — Session token check, capability
  authorization, profile field permissions, network gate.
- `backend/db/` — Database models, migrations and data
  access.
- `backend/voice/` — (Goal 3) Speech-to-text and
  text-to-speech adapters. Only converts audio to text and
  text to audio; all logic stays in `core`.
- `tests/critical/` — Behavioral and security tests that
  must always pass at 100%.
- `tests/unit/` — Tests for single functions and modules.
- `tests/scenarios/` — Normal-use scenario suite (95% target)
  and voice test set.
- `docs/` — Context files, data-flow notes, known
  limitations.

## Storage Model

- **SQLite database** (in the OS user app-data folder):
  conversation history, owner profile, profile field
  sensitivity tags, capability permissions, settings,
  and a basic action log (no sensitive values).
- **Config file** (app-data folder): non-secret settings
  such as model name, RSS feed list, history limits.
- **OS keychain**: any API keys or secrets. Never in the
  database, config file, code or logs.
- **Model files**: LLM models are managed by Ollama in its
  own folder. Voice models are stored in the app-data folder.
- **No cloud storage.** Nothing about the owner is stored
  outside this machine.

## Auth and Access Model

- **Single owner.** No user accounts. Whoever is logged into
  the OS account running GHOST is the owner.
- **Backend access.** The backend listens on 127.0.0.1 only.
  Electron creates a random session token at every launch and
  passes it to the backend at startup. Every request except
  `/health` must include this token, or it is rejected.
  Requests from unexpected origins are rejected.
- **Capability access.** Every capability has a permission
  entry. Default is deny. A capability runs only if its
  permission is enabled. This check is done in code, before
  the capability runs, never by the LLM.
- **Profile data access.** Every profile field has a
  sensitivity tag (`general`, `personal`, `sensitive`). Each
  capability lists the fields it may receive. The context
  builder passes only those fields. `sensitive` fields are
  never sent outside the machine.
- **Network access.** Capabilities can reach only the domains
  on their own allowlist, and only through the network gate.

## Invariants

1. The backend binds to 127.0.0.1 only, and every request
   except `/health` requires a valid session token.
2. All outbound network calls go through the network gate.
   No other code imports or uses an HTTP client directly.
3. Authorization is enforced in code before any capability
   runs. Default is deny. Security never depends on LLM
   instructions.
4. The LLM never produces calculation, conversion, news or
   weather results on its own. Those come from capability
   code. The LLM may only phrase a result it was given.
5. GHOST never reports a result or a completed action unless
   the capability returned success. Failures are shown
   plainly.
6. A capability receives only the profile fields it has
   declared. `sensitive` fields are never sent to external
   services and never written to logs.
7. No `eval`, `exec`, shell commands or arbitrary file access
   anywhere in the codebase.
8. Text and voice requests go through the exact same
   pipeline. Voice is only an input/output adapter.
9. The conversation context sent to the model is always
   within the configured limit.
10. The React UI contains no business logic and makes no
    network calls except to the local backend.
11. Electron windows run with `contextIsolation: true`,
    `nodeIntegration: false` and `sandbox: true`.
12. No cloud LLM or cloud speech service is called.