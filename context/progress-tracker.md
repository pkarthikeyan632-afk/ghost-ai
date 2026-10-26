# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Phase 1 — Project skeleton.

## Current Goal

- Goal 1 — Build a reliable AI assistant (target: 2 weeks)
- Right now: finish the remaining backend and test setup.

## Completed

- `project-overview.md` — goals, scope, success criteria
- `ai-workflow-rules.md` — how work is scoped, split and
  checked
- `architecture.md` — stack, boundaries, storage, access
  model, invariants
- `conventions.md` — code standards
- `00-desktop-skeleton` — secure Electron + React + TypeScript
  + Vite + Tailwind app with linting and a passing Vitest test.

## In Progress

- None.

## Next Up

Build in this order. One unit at a time.

1. Remaining repo skeleton: `backend/`, `tests/`, `docs/`,
   Python tooling (ruff, mypy, pytest)
2. Backend skeleton: FastAPI app bound to 127.0.0.1 with
   `/health`
3. Session token middleware + critical tests
   (no token → rejected)
4. Network gate + test that fails if `httpx` is imported
   anywhere else
5. Ollama client: availability check, timeout, clear error
   when the model is down
6. `/chat` route through the core pipeline (chat capability
   only)
7. Router with fixed rules (chat / calc / units /
   unsupported)
8. Calc capability (safe parser, no `eval`) + tests
9. Units capability (pint) + tests
10. Electron shell: starts backend, creates token, secure
    window settings
11. React chat screen: send message, show loading, answer
    and errors
12. Bounded conversation history (SQLite)
13. News capability (RSS via network gate)
14. Weather capability (provider interface + Open-Meteo)
15. Capability authorization (default deny) wired into
    the pipeline
16. Critical test suite to 20+ and normal-use scenario
    suite

## Open Questions

- Team: solo developer or a team? Skill level in Python
  and React?
- Hardware: OS, RAM, GPU? (decides which model we run)
- Which Ollama model to use?
- History sent to the model: how many turns or tokens?
- Stored history: how long is it kept, and can the owner
  delete it?
- Which RSS feeds for news?
- Weather: which location by default? Is the city stored
  in the profile?
- What profile fields will exist, and how is each tagged
  (`general`, `personal`, `sensitive`)?
- How does the owner turn capabilities on or off (settings
  screen or config file)?
- What exactly counts as "ambiguous" vs "unsupported", and
  how should GHOST reply to each?
- Confirm stack choices: Open-Meteo, SQLite, faster-whisper,
  Piper, Tailwind

## Architecture Decisions

- **Security built from the first unit, not in week 4.**
  Why: adding it later means rewriting the pipeline.
- **Backend binds to 127.0.0.1 with a per-launch session
  token.** Why: otherwise any program on the machine could
  call GHOST's backend.
- **Rules-first routing, LLM only as fallback.** Why: rules
  are predictable and testable; needed for 100% on critical
  tests.
- **Deterministic code for calc, units, news, weather.** Why:
  the LLM can make up numbers and facts; code cannot.
- **All internet access through one network gate with
  per-capability allowlists.** Why: one place to control and
  test what leaves the machine.
- **SQLite for local storage.** Why: one local file, safer
  than JSON for history and permissions, easy migrations.
- **Secrets only in the OS keychain.** Why: keeps keys out
  of files, code and logs.
- **Voice is only an input/output adapter.** Why: voice
  requests get the same checks as text without extra code.
- **Tests check behavior, with model fixed and
  temperature 0.** Why: LLM wording changes between runs.

## Session Notes

- All four context files are drafted. They are the source
  of truth; code must follow them.
- The default Electron menu bar (File, Edit, View, Window)
  remains for development; replace it with a minimal menu in
  a later unit.
- Desktop skeleton cleanup verified: root Next.js dependencies
  and public assets are removed, build output is ignored, the
  Electron security settings are enabled, and a dev-page reload
  made no requests outside localhost.
- `01-design-system.md` currently contains the desktop skeleton
  specification; add the actual design-system requirements
  before starting that unit.
- Next session: answer the open questions (at least team,