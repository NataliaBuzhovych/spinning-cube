# Spinning Cube

See [SPEC.md](SPEC.md) for what to build.

## Stack

- Vite + React + TypeScript
- three, @react-three/fiber (R3F), @react-three/drei
- ESLint (typescript-eslint, react-hooks, @vitest/eslint-plugin, eslint-plugin-playwright) + Prettier
- Vitest + Testing Library + @react-three/test-renderer (unit), v8 coverage
- Playwright (e2e, Chromium)
- TypeScript pinned to 6.0.x (typescript-eslint doesn't support 7 yet)

## Structure

- `index.html` — Vite entry
- `src/main.tsx` — React root
- `src/App.tsx` — full-screen `Canvas`, lights, `OrbitControls`
- `src/Cube.tsx` — rotating cube mesh
- `e2e/` — Playwright specs; `.github/workflows/ci.yml` — CI
- `src/index.css` — global styles
- `src/*.test.{ts,tsx}` — tests, next to the code (`src/lint-rules.test.ts` checks the test-integrity lint rules); `src/test-setup.ts` loads jest-dom
- `public/` — static assets
- `SPEC.md` — product spec

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server
- `npm run build` — typecheck and production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc -b`
- `npm test` — Vitest (single run)
- `npm run test:coverage` — Vitest with v8 coverage; fails below the thresholds in `vite.config.ts`
- `npm run e2e` — Playwright (builds and serves the app itself; first run needs `npx playwright install chromium`)
- `npm run format` / `npm run format:check` — Prettier
- `npm run preview` — serve the production build

## Quality gates

Layers: the Stop hook is the fast loop, `pre-push` is the full local check, CI is authoritative.

- Claude Code Stop hook (`.claude/hooks/quality-gate.sh`) runs the fast gates: lint, typecheck, `test:coverage` and `format:check`. On failure it prints to stderr and exits 2. On the 5th failed attempt it writes the last output to `.claude/quality-gate-failure.md` (gitignored), prints "Quality gate not passed: work is incomplete, do not open a PR" to stderr and lets Claude stop. The file is deleted when the gate next passes.
- Husky `pre-commit` hook (`.husky/pre-commit`) blocks commits on `main` and prints "Create a feature branch first".
- Husky `pre-push` hook is the full local check: it fails if `.claude/quality-gate-failure.md` exists, runs the same four fast gates as the Stop hook, then `npm run e2e` (too slow for the Stop hook).
- PreToolUse hook (`.claude/hooks/block-push-on-failure.sh`, registered in `.claude/settings.json`) blocks `git push` while `.claude/quality-gate-failure.md` exists. It guards against accidental skipping, not deliberate bypass.
- CI (`.github/workflows/ci.yml`) is authoritative. It has two jobs, `checks` (lint, typecheck, unit tests with coverage) and `e2e` (Playwright). Both are required status checks in branch protection before a PR can be merged.
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
- Never weaken or delete a test to make it pass; fix the cause. Partly machine-enforced:
  - ESLint fails on `.skip`, `.only`, `.todo`, `.fixme`, `skipIf` and runtime `skip()` on `it`/`test`/`describe`/`test.describe` (`eslint.config.js`, locked in by `src/lint-rules.test.ts`).
  - Test files cannot bypass those rules: `eslint-disable` comments for `vitest/*`, `@vitest/*`, `playwright/*` and `no-restricted-syntax` are errors, unlimited `eslint-disable` is an error, inline config is ignored, and unused disable directives are errors.
  - Coverage excludes `src/App.tsx` and `src/main.tsx` (covered by e2e). Thresholds in `vite.config.ts` are set from measured coverage and enforced by `npm run test:coverage`. Never lower them; raise them when coverage improves. Nothing in code stops you editing the numbers down, so this is a rule you follow and a reviewer checks.
- If `.claude/quality-gate-failure.md` exists, the quality gate has not passed: report the failure to the user, do not open a PR, push, or claim the task is done.
- Run `npm run lint`, `npm run typecheck`, `npm run test:coverage` and `npm run format:check` before committing code changes.
