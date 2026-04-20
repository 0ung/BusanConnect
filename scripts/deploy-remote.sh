#!/bin/sh
set -eu

IMAGE_REF="${IMAGE_REF:?IMAGE_REF is required}"
CONTAINER_NAME="${CONTAINER_NAME:-busan-visited-frontend}"
HOST_PORT="${HOST_PORT:-80}"

if [ -n "${GHCR_USERNAME:-}" ] && [ -n "${GHCR_TOKEN:-}" ]; then
  printf '%s' "${GHCR_TOKEN}" | docker login ghcr.io -u "${GHCR_USERNAME}" --password-stdin
fi

docker pull "${IMAGE_REF}"
docker logout ghcr.io >/dev/null 2>&1 || true

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${HOST_PORT}:80" \
  -e VITE_FRONTEND_FORGE_API_KEY="${VITE_FRONTEND_FORGE_API_KEY:-}" \
  -e VITE_FRONTEND_FORGE_API_URL="${VITE_FRONTEND_FORGE_API_URL:-https://forge.butterfly-effect.dev}" \
  "${IMAGE_REF}"

docker image prune -f >/dev/null 2>&1 || true
