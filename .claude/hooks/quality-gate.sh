#!/usr/bin/env bash
# Claude Code Stop hook: run lint, typecheck, tests with coverage and the format
# check before Claude finishes. On failure, print errors to stderr and exit 2 so
# Claude keeps working.
# After MAX_ATTEMPTS consecutive failures, write the last output to
# .claude/quality-gate-failure.md (the failure marker), say so on stderr, show it
# to the human via continue:false/stopReason JSON on stdout and let Claude stop. The marker is deleted on the next success.

MAX_ATTEMPTS=5
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

COUNTER=.claude/.quality-gate-failures
MARKER=.claude/quality-gate-failure.md
attempts=$(cat "$COUNTER" 2>/dev/null || echo 0)

failed=0
report=""
for script in lint typecheck test:coverage format:check; do
  if ! output=$(npm run --silent "$script" 2>&1); then
    failed=1
    report+=$(printf '== npm run %s failed ==\n%s\n\n' "$script" "$output")$'\n'
  fi
done

if [ "$failed" -eq 0 ]; then
  rm -f "$COUNTER" "$MARKER"
  exit 0
fi

printf '%s' "$report" >&2

attempts=$((attempts + 1))
if [ "$attempts" -ge "$MAX_ATTEMPTS" ]; then
  rm -f "$COUNTER"
  {
    printf '# Quality gate failure\n\nFailed %s times. Last output:\n\n```\n%s\n```\n' "$MAX_ATTEMPTS" "$report"
  } > "$MARKER"
  MSG="Quality gate not passed: work is incomplete, do not open a PR"
  echo "$MSG" >&2
  # continue:false + stopReason shows the message to the human (stdout must be only this JSON)
  printf '{"continue": false, "stopReason": "%s"}\n' "$MSG"
  exit 0
fi

echo "$attempts" > "$COUNTER"
echo "Quality gate failed (attempt $attempts/$MAX_ATTEMPTS). Fix the errors above." >&2
exit 2
