# Git Flow Strategy

## Branches

- `main`: production branch. Only release and hotfix changes land here.
- `develop`: default integration branch for daily development.
- `feature/<name>`: branch from `develop`, merge back into `develop`.
- `release/<version>`: branch from `develop`, stabilize for production, then merge into `main` and back into `develop`.
- `hotfix/<name>`: branch from `main`, fix production issues, then merge into `main` and back into `develop`.

## Rules

- Start normal work from `develop`.
- Open PRs from `feature/*` into `develop`.
- Open PRs from `release/*` into `main` after validation is complete.
- Open PRs from `hotfix/*` into `main` for urgent production fixes.
- After merging into `main`, sync the same change back to `develop`.

## CI/CD

- CI runs on `main`, `develop`, `feature/*`, `release/*`, and `hotfix/*`.
- Production deployment runs only from `main`.
- Production deployment builds the Docker image once in GitHub Actions, pushes it to `GHCR`, and deploys the same image to both app servers.
- The front Nginx layer distributes traffic to both production app servers with round robin.
- Production credentials stay in the GitHub Actions `production` environment secrets.

## Secrets Policy

- Never commit API keys, SSH keys, tokens, or `.env` files.
- Store deployment credentials only in GitHub Secrets.
- Rotate SSH deploy keys when team membership or infrastructure changes.

