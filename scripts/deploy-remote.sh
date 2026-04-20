#!/bin/sh
set -eu

IMAGE_REF="${IMAGE_REF:?IMAGE_REF is required}"
CONTAINER_NAME="${CONTAINER_NAME:-busan-visited-frontend}"
HOST_PORT="${HOST_PORT:-80}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:${HOST_PORT}/}"

check_http() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsS "${HEALTHCHECK_URL}" >/dev/null
    return 0
  fi

  if command -v wget >/dev/null 2>&1; then
    wget -q -O /dev/null "${HEALTHCHECK_URL}"
    return 0
  fi

  echo "Neither curl nor wget is available for health checks." >&2
  return 1
}

docker pull "${IMAGE_REF}"

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${HOST_PORT}:80" \
  -e VITE_FRONTEND_FORGE_API_KEY="${VITE_FRONTEND_FORGE_API_KEY:-}" \
  -e VITE_FRONTEND_FORGE_API_URL="${VITE_FRONTEND_FORGE_API_URL:-https://forge.butterfly-effect.dev}" \
  "${IMAGE_REF}"

attempt=1
max_attempts=20

while [ "${attempt}" -le "${max_attempts}" ]; do
  if check_http; then
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi

  sleep 2
  attempt=$((attempt + 1))
done

echo "Deployment health check failed for ${HEALTHCHECK_URL}" >&2
docker logs "${CONTAINER_NAME}" --tail 100 >&2 || true
exit 1
