#!/usr/bin/env bash
# Claude Code Stop hook: run lint, typecheck and tests before Claude finishes.
# On failure, print errors to stderr and exit 2 so Claude keeps working.
# After MAX_ATTEMPTS consecutive failures, give up and let Claude stop.

MAX_ATTEMPTS=5
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

COUNTER=.claude/.quality-gate-failures
attempts=$(cat "$COUNTER" 2>/dev/null || echo 0)

failed=0
for script in lint typecheck test; do
  if ! output=$(npm run --silent "$script" 2>&1); then
    failed=1
    printf '== npm run %s failed ==\n%s\n\n' "$script" "$output" >&2
  fi
done

if [ "$failed" -eq 0 ]; then
  rm -f "$COUNTER"
  exit 0
fi

attempts=$((attempts + 1))
if [ "$attempts" -ge "$MAX_ATTEMPTS" ]; then
  rm -f "$COUNTER"
  echo "Quality gate failed $MAX_ATTEMPTS times; giving up. Fix the errors above manually." >&2
  exit 0
fi

echo "$attempts" > "$COUNTER"
echo "Quality gate failed (attempt $attempts/$MAX_ATTEMPTS). Fix the errors above." >&2
exit 2
