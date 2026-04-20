# Production Deployment

## Architecture

- GitHub Actions builds the production Docker image once.
- The image is pushed to `ghcr.io/0ung/busanconnect-frontend`.
- Both app servers pull the exact same image tag.
- A front Nginx node load-balances requests to both app servers with round robin.

## Production App Servers

- App server 1: `168.107.6.209`
- App server 2: `168.107.25.250`
- Container name: `busan-visited-frontend`
- App port: `80`

Both app servers must already be logged in to `ghcr.io`:

```bash
sudo docker login ghcr.io -u 0ung
```

## GitHub Actions Secrets

Add these `production` environment secrets:

- `OCI_SSH_PRIVATE_KEY`
- `OCI_APP_1_HOST`
- `OCI_APP_1_PORT`
- `OCI_APP_1_USER`
- `OCI_APP_2_HOST`
- `OCI_APP_2_PORT`
- `OCI_APP_2_USER`
- `VITE_FRONTEND_FORGE_API_URL`
- `VITE_FRONTEND_FORGE_API_KEY` (optional)

Recommended values for the current infrastructure:

- `OCI_APP_1_HOST=168.107.6.209`
- `OCI_APP_1_PORT=22`
- `OCI_APP_1_USER=opc`
- `OCI_APP_2_HOST=168.107.25.250`
- `OCI_APP_2_PORT=22`
- `OCI_APP_2_USER=opc`

## Deployment Flow

1. Push to `main`.
2. GitHub Actions runs install, typecheck, test, and build.
3. GitHub Actions pushes the image to `GHCR`.
4. GitHub Actions connects to both app servers over SSH.
5. Each app server runs `docker pull`, replaces the container, and verifies `http://127.0.0.1:80/`.

## Front Nginx

Use `infra/nginx/busanconnect-lb.conf` on the front load-balancer node.

Typical install steps on the front node:

```bash
sudo cp /path/to/busanconnect-lb.conf /etc/nginx/conf.d/busanconnect.conf
sudo nginx -t
sudo systemctl reload nginx
```

The front Nginx node should be a dedicated entry point or reverse proxy tier. Do not place this round-robin config on top of the same app container port on the backend nodes.
