# Spinning Cube

See [SPEC.md](SPEC.md) for what to build.

## Stack
- Vite + React + TypeScript
- three, @react-three/fiber (R3F), @react-three/drei
- oxlint for linting

## Structure
- `index.html` — Vite entry
- `src/main.tsx` — React root
- `src/App.tsx` — top-level component (canvas lives here)
- `src/index.css` — global styles
- `public/` — static assets
- `SPEC.md` — product spec

## Commands
- `npm install` — install dependencies
- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) and production build
- `npm run lint` — oxlint
- `npm run preview` — serve the production build

## Rules
- Small, focused commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`...).
- Never use `--no-verify` (or otherwise skip hooks).
- Never force push.
- Run `npm run lint` and `npm run build` before committing code changes.
