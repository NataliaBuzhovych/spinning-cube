# Spinning Cube

See [SPEC.md](SPEC.md) for what to build.

## Stack

- Vite + React + TypeScript
- three, @react-three/fiber (R3F), @react-three/drei
- ESLint (typescript-eslint, react-hooks) + Prettier
- Vitest + Testing Library (jsdom)
- TypeScript pinned to 6.0.x (typescript-eslint doesn't support 7 yet)

## Structure

- `index.html` — Vite entry
- `src/main.tsx` — React root
- `src/App.tsx` — top-level component (canvas lives here)
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
- `npm run format` / `npm run format:check` — Prettier
- `npm run preview` — serve the production build

## Rules

- Small, focused commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`...).
- Never use `--no-verify` (or otherwise skip hooks).
- Never force push.
- Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run format:check` before committing code changes.
