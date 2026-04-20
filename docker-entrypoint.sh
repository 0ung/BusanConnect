#!/bin/sh
set -eu

escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

FORGE_API_KEY_ESCAPED="$(escape_js "${VITE_FRONTEND_FORGE_API_KEY:-}")"
FORGE_API_URL_ESCAPED="$(escape_js "${VITE_FRONTEND_FORGE_API_URL:-}")"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  VITE_FRONTEND_FORGE_API_KEY: "${FORGE_API_KEY_ESCAPED}",
  VITE_FRONTEND_FORGE_API_URL: "${FORGE_API_URL_ESCAPED}"
};
EOF
