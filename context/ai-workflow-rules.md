# AI Workflow Rules

## Approach

Build GHOST incrementally using a spec-driven workflow.
The context files are the source of truth:

- `project-overview.md` — what GHOST is, goals, scope
- `architecture.md` — how it is built, boundaries, invariants
- `conventions.md` — code style, naming, testing standards
- `progress-tracker.md` — current state, done work, open questions

Always implement against these specs. Do not infer or
invent behavior from scratch. If the specs and the code
disagree, stop and flag it — do not silently pick one.

Security is built in from the first unit, not added later.
Every new capability must go through validation, routing,
authorization and result checking like every other one.

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large
  speculative changes
- Do not combine unrelated system boundaries in a
  single implementation step
- Every unit must include its tests in the same step
- Never weaken or delete an existing test to make
  new code pass

## When to Split Work

Split an implementation step if it combines:

- Frontend (React/Electron) changes and backend
  (FastAPI) changes
- More than one capability (e.g. news and weather,
  or calc and units)
- Security code (auth, token, network gate, profile
  permissions) and feature code
- Storage/schema changes and feature logic
- LLM prompt changes and routing rule changes
- Behavior not clearly defined in the context files

If a change cannot be verified end to end quickly,
the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the
  context files
- If a requirement is ambiguous, resolve it in the
  relevant context file before implementing
- If a requirement is missing, add it as an open question
  in `progress-tracker.md` before continuing
- If the safe choice is unclear, choose the more
  restrictive behavior (deny, refuse, or ask) and
  log it as an open question

## Protected Files

Do not modify the following unless explicitly instructed:

- `backend/security/*` — token auth, authorization,
  network gate, profile field permissions
- `tests/critical/*` — critical behavioral and security
  tests (add new ones freely, never edit or remove
  existing ones without approval)
- `backend/db/migrations/*` — migrations already applied
- `.env`, `.env.example` and any secrets or keys
- `package-lock.json`, `requirements.lock` — change
  only by adding/upgrading a dependency on purpose
- Any third-party library internals (`node_modules/`,
  site-packages)

## Keeping Docs in Sync

Update the relevant context file whenever implementation
changes:

- System architecture or boundaries → `architecture.md`
- Storage model decisions → `architecture.md`
- Code conventions or standards → `conventions.md`
- Feature scope → `project-overview.md`
- Security controls, external data flows, known
  limitations → `architecture.md` (security section)
- New capability, model change, or routing rule →
  `architecture.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. All tests in `tests/critical/` pass at 100%
4. `pytest` passes for the backend
5. `npm run build` and `npm run lint` pass for the desktop app
6. `progress-tracker.md` reflects the completed work
   and any new open questions