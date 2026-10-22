# Spinning Cube

A single rotating cube rendered in a full-screen canvas, built with React Three Fiber and drei. Drag with the mouse to orbit the view (`OrbitControls`). See [openspec/specs/](openspec/specs/rotating-cube/spec.md) for the full spec.

**Live demo:** https://spinning-cube-git-chore-adopt-openspec-natalia-buzhovych.vercel.app/

**All code in this repository is written by AI agents.**

## Stack

- Vite + React + TypeScript
- three, @react-three/fiber (R3F), @react-three/drei
- ESLint (typescript-eslint, react-hooks, @vitest/eslint-plugin, eslint-plugin-playwright) + Prettier
- Vitest + Testing Library + @react-three/test-renderer (unit tests), v8 coverage
- Playwright (e2e, Chromium)

## Install and run

```bash
npm install
npm run dev
```

Then open the URL printed by Vite. To serve a production build instead:

```bash
npm run build
npm run preview
```

The first e2e run needs the Chromium browser: `npx playwright install chromium`.

## npm scripts

| Script                  | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                               |
| `npm run build`         | Typecheck (`tsc -b`) and produce a production build     |
| `npm run preview`       | Serve the production build                              |
| `npm run lint`          | Run ESLint                                              |
| `npm run typecheck`     | Run `tsc -b`                                            |
| `npm test`              | Run Vitest once                                         |
| `npm run test:coverage` | Run Vitest with v8 coverage and thresholds              |
| `npm run e2e`           | Run Playwright (builds and serves the app on port 4173) |
| `npm run format`        | Format everything with Prettier                         |
| `npm run format:check`  | Check formatting with Prettier                          |
| `npm run prepare`       | Install Husky git hooks (runs automatically on install) |

## Project structure

```
.
├── index.html                  # Vite entry
├── src/
│   ├── main.tsx                # React root
│   ├── App.tsx                 # Full-screen Canvas, lights, OrbitControls
│   ├── Cube.tsx                # Rotating cube mesh
│   ├── Cube.test.tsx           # Unit test (tests live next to the code)
│   ├── test-setup.ts           # Loads jest-dom
│   └── index.css               # Global styles
├── e2e/canvas.spec.ts          # Playwright specs
├── public/favicon.svg          # Static assets
├── playwright.config.ts        # Playwright config
├── vite.config.ts              # Vite / Vitest config
├── eslint.config.js            # ESLint config
├── .prettierrc.json            # Prettier config
├── tsconfig*.json              # TypeScript configs
├── openspec/                   # OpenSpec: specs/ (current spec), changes/, config.yaml
├── SPEC.md                     # Pointer to openspec/
├── CLAUDE.md                   # Instructions for AI agents
├── .claude/
│   ├── settings.json           # Hook registration and permission deny rules
│   ├── hooks/                  # quality-gate.sh (Stop), block-push-on-failure.sh (PreToolUse)
│   ├── skills/                 # openspec-* skills
│   └── commands/opsx/          # /opsx:* commands
├── .husky/pre-commit           # Git pre-commit hook
├── .husky/pre-push             # Git pre-push hook
└── .github/workflows/ci.yml    # CI workflow
```

## Harness

The repository is set up so that AI agents can work on it autonomously while guardrails keep the result correct.

### CLAUDE.md

[CLAUDE.md](CLAUDE.md) is loaded by Claude Code as project instructions. It points to the spec and lists the stack, structure, commands, quality gates and rules, including:

- Small, focused commits using Conventional Commits.
- Never use `--no-verify` or otherwise skip hooks.
- Never force push.
- Follow the Git workflow section: every task gets a new branch from an updated `main` (`feat/...`, `fix/...`, `docs/...`, `chore/...`), never commit on another task's branch, never push to `main`, and open a pull request.
- Never weaken or delete a test to make it pass; fix the cause. ESLint fails on skipped, focused, todo and disabled tests (and on `eslint-disable` comments that try to bypass those rules), and coverage thresholds in `vite.config.ts` may only go up. See [Trust model](#trust-model).
- Run `npm run lint`, `npm run typecheck`, `npm run test:coverage` and `npm run format:check` before committing code changes.

### OpenSpec

[OpenSpec](https://openspec.dev) drives spec-driven development. The current spec is in [openspec/specs/](openspec/specs/rotating-cube/spec.md): one cube, centered and continuously rotating, in a canvas that fills the viewport and resizes with the window, with drag-to-orbit via drei's `OrbitControls`. [SPEC.md](SPEC.md) only points there.

Every behavior change follows the workflow, using the Claude Code commands installed by `openspec init`:

1. `/opsx:propose "<idea>"` writes a change under `openspec/changes/<name>/` (proposal, delta specs, design, tasks).
2. `/opsx:apply` implements the tasks.
3. `/opsx:archive` archives the change and merges its delta specs into `openspec/specs/`.

`/opsx:explore` helps investigate before proposing. Code is never changed before the spec change is written.

Install the CLI (needed for `openspec init` and other `openspec` commands):

```bash
npm install -g @fission-ai/openspec@latest
```

### Quality gate layers

- **Stop hook** = fast loop.
- **`pre-push`** = full local check.
- **CI** = authoritative.

### Stop hook

Registered in `.claude/settings.json`, `.claude/hooks/quality-gate.sh` runs when Claude Code tries to finish. It runs `npm run lint`, `npm run typecheck`, `npm run test:coverage` and `npm run format:check`. If any fail, it prints the output to stderr and exits with code 2, so Claude keeps working to fix them. E2E is not run here because it is too slow.

On the 5th failed attempt it gives up and lets Claude stop, but not silently: see [Failure marker](#failure-marker).

`.claude/settings.json` also denies `git push --force`, `-f`, `--force-with-lease` and any git command using `--no-verify`.

### Failure marker

When the Stop hook gives up it writes the last output to `.claude/quality-gate-failure.md` (gitignored) and prints "Quality gate not passed: work is incomplete, do not open a PR" to stderr. It also prints `{"continue": false, "stopReason": "Quality gate not passed: work is incomplete, do not open a PR"}` as JSON on stdout (exit code 0), which Claude Code shows to the human as the reason it stopped. The file is deleted the next time the hook passes. While it exists:

- `.husky/pre-push` fails.
- The PreToolUse hook `.claude/hooks/block-push-on-failure.sh` (registered for the `Bash` tool in `.claude/settings.json`) blocks `git push` from Claude Code with exit code 2.
- CLAUDE.md tells the agent to report the failure and not claim the task is done.

Limits: this is a guard against accidental skipping, not against deliberate bypass. Deleting the file, pushing from a terminal with hooks disabled, or a command shape the hook's pattern misses all get around it. CI and branch protection stay the final check.

### Husky pre-commit hook

`.husky/pre-commit` blocks any commit made while the current branch is `main`, printing "Create a feature branch first".

### Husky pre-push hook

`.husky/pre-push` is the full local check. It fails if the failure marker exists, then runs `npm run lint && npm run typecheck && npm run test:coverage && npm run format:check` (the same gates as the Stop hook) and finally `npm run e2e`. Husky is installed through the `prepare` script, so `npm install` sets it up.

### CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests, using Node 24. It has two jobs:

- `checks`: `npm ci`, then `npm run lint`, `npm run typecheck` and `npm run test:coverage` (uploads `coverage` as an artifact).
- `e2e`: `npm ci`, installs Chromium with Playwright, then `npm run e2e`. On failure it uploads `test-results` as the `playwright-results` artifact.

### Branch protection

Work goes through pull requests: `main` is never pushed to directly (a rule in CLAUDE.md), and CI runs on every pull request. CI has two jobs, `checks` and `e2e`, and both are required status checks in branch protection before a PR can be merged.

## Trust model

Not every rule here is enforced by code:

- The lint rules against skipped, focused and todo tests, and the ban on disabling them with comments, are enforced by ESLint and checked in CI.
- "Coverage thresholds only go up" is enforced by **review, not by code**. The thresholds in `vite.config.ts` make `npm run test:coverage` fail when coverage drops below them, but nothing stops someone from editing the numbers down in the same change. A human reviewing the PR is the final check: look at any diff that touches `vite.config.ts` or `eslint.config.js`.
- The local gates (Stop hook, PreToolUse hook, Husky `pre-commit` and `pre-push`) are a convenience for fast feedback. A human can bypass them, for example with `--no-verify` or by editing the hooks. The authoritative checks are CI plus branch protection: the `checks` and `e2e` jobs must pass before a PR can merge.
