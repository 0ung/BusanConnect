#!/bin/sh
set -eu

IMAGE_NAME="${IMAGE_NAME:-busanconnect-frontend}"
CONTAINER_NAME="${CONTAINER_NAME:-busan-visited-frontend}"
HOST_PORT="${HOST_PORT:-80}"

docker build -t "${IMAGE_NAME}:latest" .

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${HOST_PORT}:80" \
  -e VITE_FRONTEND_FORGE_API_KEY="${VITE_FRONTEND_FORGE_API_KEY:-}" \
  -e VITE_FRONTEND_FORGE_API_URL="${VITE_FRONTEND_FORGE_API_URL:-https://forge.butterfly-effect.dev}" \
  "${IMAGE_NAME}:latest"

docker image prune -f >/dev/null 2>&1 || true
