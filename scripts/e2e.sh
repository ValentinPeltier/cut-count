#!/usr/bin/env bash
# Local e2e: throwaway MySQL and Maildev, Next.js dev server, then Cypress.
# Pass --gui to open the Cypress UI. Any other arguments are forwarded to Cypress.
set -euo pipefail

cd "$(dirname "$0")/.."

MYSQL_CONTAINER=count-e2e-db
MAILDEV_CONTAINER=count-e2e-maildev
MYSQL_PORT=3307
MAILDEV_SMTP_PORT=1025
MAILDEV_UI_PORT=1080
APP_PORT=3001
APP_URL="http://127.0.0.1:${APP_PORT}/login"

mysql_started=0
maildev_started=0
app_pid=

cleanup() {
  if [[ -n "${app_pid}" ]] && kill -0 "$app_pid" 2>/dev/null; then
    kill -- -"$app_pid" 2>/dev/null || kill "$app_pid" 2>/dev/null || true
    wait "$app_pid" 2>/dev/null || true
  fi
  if [[ "$mysql_started" == 1 ]]; then
    docker rm -f "$MYSQL_CONTAINER" >/dev/null 2>&1 || true
  fi
  if [[ "$maildev_started" == 1 ]]; then
    docker rm -f "$MAILDEV_CONTAINER" >/dev/null 2>&1 || true
  fi
}

require_container_absent() {
  local name=$1
  if docker ps -a --format '{{.Names}}' | grep -qx "$name"; then
    echo "Container ${name} already exists. Remove it with: docker rm -f ${name}" >&2
    exit 1
  fi
}

require_port_free() {
  local port=$1
  if bash -c "echo >/dev/tcp/127.0.0.1/${port}" 2>/dev/null; then
    echo "Port ${port} is already in use. Stop whatever is listening before running e2e tests." >&2
    exit 1
  fi
}

gui=0
cypress_args=()
for arg in "$@"; do
  if [[ "$arg" == "--gui" ]]; then
    gui=1
  elif [[ "$arg" != "--" ]]; then
    cypress_args+=("$arg")
  fi
done

require_container_absent "$MYSQL_CONTAINER"
require_container_absent "$MAILDEV_CONTAINER"
require_port_free "$MYSQL_PORT"
require_port_free "$MAILDEV_SMTP_PORT"
require_port_free "$MAILDEV_UI_PORT"
require_port_free "$APP_PORT"

trap cleanup EXIT

docker run -d --name "$MYSQL_CONTAINER" \
  -p "${MYSQL_PORT}:3306" \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_USER=count \
  -e MYSQL_PASSWORD=count \
  -e MYSQL_DATABASE=count_test \
  mysql:8.0
mysql_started=1

docker run -d --name "$MAILDEV_CONTAINER" \
  -p "${MAILDEV_UI_PORT}:1080" \
  -p "${MAILDEV_SMTP_PORT}:1025" \
  maildev/maildev:2.2.1
maildev_started=1

echo "Waiting for MySQL on port ${MYSQL_PORT}..."
ready=0
for _ in $(seq 1 60); do
  if docker exec "$MYSQL_CONTAINER" mysqladmin ping -h 127.0.0.1 -u count -pcount --silent >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done

if [[ "$ready" != 1 ]]; then
  echo "MySQL did not become ready on port ${MYSQL_PORT}." >&2
  exit 1
fi

yarn db:test:prepare

echo "Starting the dev server on port ${APP_PORT}..."
setsid yarn with-test-env next dev &
app_pid=$!

yarn wait-on "$APP_URL" --timeout 120000

if [[ "$gui" == 1 ]]; then
  cypress_command=(cypress open)
else
  cypress_command=(cypress run)
fi

set +e
yarn with-test-env "${cypress_command[@]}" "${cypress_args[@]}"
status=$?
set -e
exit "$status"
