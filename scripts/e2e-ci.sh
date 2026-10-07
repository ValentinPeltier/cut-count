#!/usr/bin/env bash
# CI e2e: MySQL and Maildev are provided by the workflow.
# Serve the standalone production build, then run Cypress headless.
# Extra arguments are forwarded to `cypress run` (for example --spec).
set -euo pipefail

cd "$(dirname "$0")/.."

APP_URL=http://127.0.0.1:3001/login
app_pid=

cleanup() {
  if [[ -n "${app_pid}" ]] && kill -0 "$app_pid" 2>/dev/null; then
    kill -- -"$app_pid" 2>/dev/null || kill "$app_pid" 2>/dev/null || true
    wait "$app_pid" 2>/dev/null || true
  fi
}

if [[ ! -f .next/standalone/server.js ]]; then
  echo "Missing .next/standalone/server.js. Extract the production build before scripts/e2e-ci.sh." >&2
  exit 1
fi

cypress_args=()
for arg in "$@"; do
  if [[ "$arg" != "--" ]]; then
    cypress_args+=("$arg")
  fi
done

trap cleanup EXIT

yarn db:test:prepare

echo "Starting the production server..."
setsid yarn with-test-env node .next/standalone/server.js &
app_pid=$!

yarn wait-on "$APP_URL" --timeout 60000

set +e
yarn with-test-env cypress run "${cypress_args[@]}"
status=$?
set -e
exit "$status"
