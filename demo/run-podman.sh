#!/bin/sh
# Run the AFSMS demo with plain podman — no compose provider required.
#
#   ./demo/run-podman.sh up      build, start db + app, print the URL
#   ./demo/run-podman.sh down    remove the pod (keeps the database volume)
#   ./demo/run-podman.sh reset   remove the pod and the database volume
#   ./demo/run-podman.sh logs    follow the app log
#
# Uses rootful podman via sudo when not already root.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
IMAGE=localhost/afsms-demo:latest
POD=afsms-demo
DB=afsms-demo-db
APP=afsms-demo-app
VOL=afsms-demo-pgdata
PORT=${DEMO_PORT:-8080}

run() {
  if [ "$(id -u)" -eq 0 ]; then
    podman "$@"
  else
    sudo podman "$@"
  fi
}

case "${1:-up}" in
  up)
    run build -t "$IMAGE" "$ROOT"
    if run pod exists "$POD" >/dev/null 2>&1; then
      run pod rm -f "$POD" >/dev/null
    fi
    run pod create --name "$POD" -p "$PORT:8080"
    run run -d --pod "$POD" --name "$DB" \
      -e POSTGRES_DB=afsms \
      -e POSTGRES_USER=afsms \
      -e POSTGRES_PASSWORD=afsms \
      -v "$VOL:/var/lib/postgresql/data:Z" \
      -v "$ROOT/demo/afsms-demo.sql:/docker-entrypoint-initdb.d/01-afsms-demo.sql:ro,Z" \
      docker.io/library/postgres:17-alpine \
      postgres -c shared_buffers=64MB -c work_mem=4MB \
               -c maintenance_work_mem=32MB -c max_connections=20 -c jit=off

    printf 'waiting for postgres'
    i=0
    until run exec "$DB" pg_isready -U afsms -d afsms >/dev/null 2>&1; do
      i=$((i + 1))
      if [ "$i" -gt 60 ]; then
        echo " timed out"
        exit 1
      fi
      printf '.'
      sleep 2
    done
    echo " ready"

    run run -d --pod "$POD" --name "$APP" \
      -e JWT_SECRET=afsms-demo-jwt-secret \
      -e SSO_MOCK_SECRET=afsms-demo-sso-secret \
      -e ALLOWED_ORIGINS="http://localhost:$PORT,http://127.0.0.1:$PORT" \
      "$IMAGE"
    echo "AFSMS demo is up: http://localhost:$PORT"
    ;;
  down)
    run pod rm -f "$POD"
    ;;
  reset)
    run pod rm -f "$POD" || true
    run volume rm -f "$VOL" || true
    ;;
  logs)
    run logs -f "$APP"
    ;;
  *)
    echo "usage: $0 [up|down|reset|logs]" >&2
    exit 2
    ;;
esac
