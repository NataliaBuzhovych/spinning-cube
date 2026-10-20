# Spinning Cube

See [SPEC.md](SPEC.md) for what to build.

## Stack

- Vite + React + TypeScript
- three, @react-three/fiber (R3F), @react-three/drei
- ESLint (typescript-eslint, react-hooks) + Prettier
- Vitest + Testing Library + @react-three/test-renderer (unit)
- Playwright (e2e, Chromium)
- TypeScript pinned to 6.0.x (typescript-eslint doesn't support 7 yet)

## Structure

- `index.html` — Vite entry
- `src/main.tsx` — React root
- `src/App.tsx` — full-screen `Canvas`, lights, `OrbitControls`
- `src/Cube.tsx` — rotating cube mesh
- `e2e/` — Playwright specs; `.github/workflows/ci.yml` — CI
- `src/index.css` — global styles
- `src/*.test.tsx` — tests, next to the code; `src/test-setup.ts` loads jest-dom
- `public/` — static assets
- `SPEC.md` — product spec

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server
- `npm run build` — typecheck and production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc -b`
- `npm test` — Vitest (single run)
- `npm run e2e` — Playwright (builds and serves the app itself; first run needs `npx playwright install chromium`)
- `npm run format` / `npm run format:check` — Prettier
- `npm run preview` — serve the production build

## Quality gates

- Claude Code Stop hook (`.claude/hooks/quality-gate.sh`) runs lint, typecheck and tests; on failure it prints to stderr and exits 2, giving up after 5 failed attempts.
- Husky `pre-commit` hook (`.husky/pre-commit`) blocks commits on `main` and prints "Create a feature branch first".
- Husky `pre-push` hook runs the same checks.
- CI (`.github/workflows/ci.yml`) has two jobs, `checks` (lint, typecheck, unit tests) and `e2e` (Playwright). Both are required status checks in branch protection before a PR can be merged.
- `git push --force`/`-f` and `--no-verify` are denied in `.claude/settings.json`.

## Git workflow

- Before starting ANY task, run `git status` and `git branch --show-current`.
- Every task gets its own new branch. Run `git fetch`, `git checkout main`, `git pull`, then `git checkout -b <type>/<short-topic>` from the updated `main`.
- Never commit on a branch created for a different task, even if it is not `main`. Never reuse a branch whose pull request is already merged.
- Branch names: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
- Never push to `main`. Push only the task branch and tell the user to open a PR.

## Rules

- Small, focused commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`...).
- Never use `--no-verify` (or otherwise skip hooks).
- Never force push.
- Never weaken or delete a test to make it pass; fix the cause.
- Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run format:check` before committing code changes.
