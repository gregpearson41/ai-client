#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# AI Client – launch backend, admin dashboard, and client
#
# Configuration
#   Default ports live in ./ports.env  –  edit that file to
#   change them permanently.  CLI flags override ports.env.
#
# Usage
#   ./start.sh
#   ./start.sh --backend 6000 --dashboard 6001 --client 6002
#   ./start.sh --help
# ─────────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── hard-coded defaults (overridden by ports.env, then CLI) ──
BACKEND_PORT=5050
DASHBOARD_PORT=3000
CLIENT_PORT=3001

# ── load ports.env ───────────────────────────────────────────
if [[ -f "$SCRIPT_DIR/ports.env" ]]; then
  # shellcheck source=/dev/null
  source "$SCRIPT_DIR/ports.env"
fi

# ── CLI flag parser ──────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend)
      BACKEND_PORT="$2"; shift 2 ;;
    --dashboard)
      DASHBOARD_PORT="$2"; shift 2 ;;
    --client)
      CLIENT_PORT="$2"; shift 2 ;;
    --help|-h)
      cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Start all three AI-Client services in one terminal.

Options:
  --backend    PORT   Express API port          (default: ${BACKEND_PORT})
  --dashboard  PORT   Admin dashboard port      (default: ${DASHBOARD_PORT})
  --client     PORT   Client frontend port      (default: ${CLIENT_PORT})
  -h, --help          Show this message

Persistent defaults live in \`ports.env\` next to this script.
CLI flags take precedence when both are present.
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1  –  run $(basename "$0") --help" >&2
      exit 1
      ;;
  esac
done

# ── sanity: make sure the three directories exist ────────────
for dir in admin-backend admin-dashboard client-frontend; do
  if [[ ! -d "$SCRIPT_DIR/$dir" ]]; then
    echo "ERROR: directory '$dir' not found in $SCRIPT_DIR" >&2
    exit 1
  fi
done

# ── install dependencies if missing ──────────────────────────
for dir in admin-backend admin-dashboard client-frontend; do
  if [[ ! -d "$SCRIPT_DIR/$dir/node_modules" ]]; then
    echo "  [$dir] node_modules missing – running npm install…"
    (cd "$SCRIPT_DIR/$dir" && npm install 2>&1)
    echo ""
  fi
done

# ── graceful shutdown on Ctrl+C ──────────────────────────────
PIDS=()

cleanup() {
  echo ""
  echo "  Shutting down all services…"

  # SIGTERM first – let processes finish cleanly
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done

  # give one second, then SIGKILL anything still alive
  sleep 1
  for pid in "${PIDS[@]}"; do
    kill -9 "$pid" 2>/dev/null || true
  done

  wait 2>/dev/null
  echo "  All services stopped."
  exit 0
}
trap cleanup SIGINT SIGTERM

# ── banner ───────────────────────────────────────────────────
echo ""
echo "  ════════════════════════════════════════════════"
echo "   AI Client  –  Starting All Services"
echo "  ════════════════════════════════════════════════"
echo "   Backend     ->  http://localhost:${BACKEND_PORT}"
echo "   Dashboard   ->  http://localhost:${DASHBOARD_PORT}"
echo "   Client      ->  http://localhost:${CLIENT_PORT}"
echo "  ════════════════════════════════════════════════"
echo "   Press Ctrl+C to stop all services"
echo "  ════════════════════════════════════════════════"
echo ""

# ── start backend (nodemon) ──────────────────────────────────
# PORT env var overrides the value in admin-backend/.env
(cd "$SCRIPT_DIR/admin-backend" && \
  PORT="$BACKEND_PORT" \
  npm run dev 2>&1) &
PIDS+=($!)

# ── start admin dashboard ────────────────────────────────────
# BROWSER=none  – prevents react-scripts from opening a tab
# PORT          – binds the dev server to the configured port
# REACT_APP_API_URL – overrides the .env value so the frontend
#                     always points at whichever port the backend
#                     is actually running on
(cd "$SCRIPT_DIR/admin-dashboard" && \
  BROWSER=none \
  PORT="$DASHBOARD_PORT" \
  REACT_APP_API_URL="http://localhost:${BACKEND_PORT}" \
  npm start 2>&1) &
PIDS+=($!)

# ── start client frontend ────────────────────────────────────
(cd "$SCRIPT_DIR/client-frontend" && \
  BROWSER=none \
  PORT="$CLIENT_PORT" \
  REACT_APP_API_URL="http://localhost:${BACKEND_PORT}" \
  npm start 2>&1) &
PIDS+=($!)

# ── wait for all background processes ────────────────────────
wait
