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
- Husky `pre-push` hook runs the same checks.
- `git push --force`/`-f` and `--no-verify` are denied in `.claude/settings.json`.

## Rules

- Small, focused commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`...).
- Never use `--no-verify` (or otherwise skip hooks).
- Never force push.
- Never push to `main`; always work in a feature branch (`feat/...`, `fix/...`, `chore/...`) and open a pull request.
- Never weaken or delete a test to make it pass; fix the cause.
- Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run format:check` before committing code changes.
