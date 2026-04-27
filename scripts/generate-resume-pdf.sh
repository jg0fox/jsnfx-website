#!/usr/bin/env bash
set -euo pipefail

VARIANT="${1:-nflx}"

case "$VARIANT" in
  nflx)
    PAGE="nflx-resume"
    OUT="public/jason-fox-resume.pdf"
    ;;
  figma)
    PAGE="figma-resume"
    OUT="public/jason-fox-resume-figma.pdf"
    ;;
  *)
    echo "Unknown variant: $VARIANT (use 'nflx' or 'figma')" >&2
    exit 1
    ;;
esac

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="http://localhost:3000/$PAGE"
PORT=3000

if [ ! -x "$CHROME" ]; then
  echo "Error: Google Chrome not found at $CHROME" >&2
  exit 1
fi

cleanup() {
  if [ -n "${DEV_PID:-}" ] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null || true
    wait "$DEV_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -qE "^[23]"; then
  echo "Using existing dev server on port $PORT"
else
  echo "Starting Next.js dev server..."
  npm run dev >/tmp/resume-pdf-dev.log 2>&1 &
  DEV_PID=$!
  until curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -qE "^[23]"; do
    if ! kill -0 "$DEV_PID" 2>/dev/null; then
      echo "Dev server failed to start. Log:" >&2
      cat /tmp/resume-pdf-dev.log >&2
      exit 1
    fi
    sleep 1
  done
  echo "Dev server ready"
fi

echo "Rendering PDF..."
"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --window-size=1280,1600 \
  --print-to-pdf="$OUT" \
  "$URL"

echo "Wrote $OUT"
