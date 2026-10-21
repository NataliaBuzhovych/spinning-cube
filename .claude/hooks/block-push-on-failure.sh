#!/usr/bin/env bash
# Claude Code PreToolUse hook (matcher: Bash): block `git push` while the stop
# hook's failure marker exists. Reads the hook JSON from stdin and checks
# tool_input.command. Exit 2 blocks the call and sends stderr to Claude.
# A guard against accidental skipping, not against deliberate bypass.

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

MARKER=.claude/quality-gate-failure.md
[ -f "$MARKER" ] || exit 0

command=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.command??"")}catch{}})')

if [[ "$command" =~ (^|[^[:alnum:]_-])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+push([[:space:]]|$) ]]; then
  echo "Blocked: $MARKER exists, so the quality gate has not passed. Work is incomplete; fix the failures (see the file) instead of pushing." >&2
  exit 2
fi
exit 0
