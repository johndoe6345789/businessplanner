# Deployment Guide (CapRover)

This guide covers deploying the Businessplanner application to a CapRover server.
The frontend and backend are deployed as two separate CapRover apps.

---

## Prerequisites

- A server with CapRover installed and configured.
- A domain name pointing to your CapRover server.
- CapRover CLI installed locally: `npm install -g caprover`.
- Docker installed locally for building images.
- A PostgreSQL 16 database (can run on CapRover via one-click apps or
  an external managed service).

---

## CapRover Setup

### 1. Install CapRover on Your Server

Follow the official CapRover setup guide at https://caprover.com/docs/get-started.html.

### 2. Configure Your Domain

Point a wildcard DNS record to your CapRover server:

```
*.apps.yourdomain.com  ->  YOUR_SERVER_IP
```

### 3. Log in to CapRover CLI

```bash
caprover login
# Enter your CapRover URL and password
```

---

## Creating Apps

### Backend App

```bash
caprover api --caproverUrl https://captain.yourdomain.com \
  --caproverPassword YOUR_PASSWORD \
  --appName businessplanner-api \
  --method POST \
  --path /api/v2/user/apps/appDefinitions/register \
  --data '{"appName":"businessplanner-api","hasPersistentData":false}'
```

Or create it via the CapRover web UI under "Apps" > "Create A New App".

### Frontend App

```bash
caprover api --caproverUrl https://captain.yourdomain.com \
  --caproverPassword YOUR_PASSWORD \
  --appName businessplanner-web \
  --method POST \
  --path /api/v2/user/apps/appDefinitions/register \
  --data '{"appName":"businessplanner-web","hasPersistentData":false}'
```

---

## Environment Variables

Configure these environment variables in the CapRover web UI for each app
under "App Configs" > "Environment Variables".

### Backend (`businessplanner-api`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `srv-captain--businessplanner-db` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `businessplanner` |
| `DB_USER` | Database user | `businessplanner_user` |
| `DB_PASSWORD` | Database password | `your_secure_password` |
| `JWT_SECRET` | Secret key for JWT signing | `your_jwt_secret_key` |
| `JWT_ACCESS_EXPIRY` | Access token TTL (seconds) | `900` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL (seconds) | `604800` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `noreply@yourdomain.com` |
| `SMTP_PASSWORD` | SMTP password or app password | `your_smtp_password` |
| `CLAUDE_API_KEY` | Anthropic API key | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `APP_URL` | Public URL of the backend | `https://businessplanner-api.yourdomain.com` |
| `FRONTEND_URL` | Public URL of the frontend | `https://businessplanner-web.yourdomain.com` |
| `CORS_ORIGINS` | Allowed CORS origins | `https://businessplanner-web.yourdomain.com` |

### Frontend (`businessplanner-web`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://businessplanner-api.yourdomain.com` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Businessplanner` |

---

## Database Setup

### Option A: CapRover One-Click App

1. Go to CapRover web UI > "One-Click Apps".
2. Search for "PostgreSQL" and deploy it.
3. Note the internal hostname: `srv-captain--<app-name>`.
4. Create the database and user:

```bash
# Connect to the PostgreSQL container
docker exec -it $(docker ps -q -f name=businessplanner-db) psql -U postgres

# Create database and user
CREATE DATABASE businessplanner;
CREATE USER businessplanner_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE businessplanner TO businessplanner_user;
\q
```

### Option B: External Managed Database

Use a managed PostgreSQL service (e.g., DigitalOcean Managed Databases,
AWS RDS, Supabase). Set the `DB_*` environment variables to point to
the external host.

### Running Migrations

After deploying the backend, run migrations via the CLI:

```bash
# SSH into the CapRover server
ssh root@your-server

# Execute migrations inside the backend container
docker exec $(docker ps -q -f name=businessplanner-api) \
  ./businessplanner-api migrate --up
```

Or include migrations in the Dockerfile entrypoint so they run on
every deployment.

---

## Deploying

### Deploy Backend

From the project root:

```bash
cd backend
caprover deploy -a businessplanner-api
```

CapRover reads `captain-definition` to locate the Dockerfile and builds
the image on the server.

### Deploy Frontend

```bash
cd frontend
caprover deploy -a businessplanner-web
```

---

## SSL / HTTPS Setup

1. In the CapRover web UI, go to each app's settings.
2. Under "HTTP Settings", click "Enable HTTPS".
3. CapRover uses Let's Encrypt to provision certificates automatically.
4. Enable "Force HTTPS" to redirect all HTTP traffic.

Both apps should have HTTPS enabled:
- `https://businessplanner-api.yourdomain.com`
- `https://businessplanner-web.yourdomain.com`

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to CapRover

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy backend to CapRover
        uses: caprover/deploy-from-github@v1.1.2
        with:
          server: ${{ secrets.CAPROVER_SERVER }}
          app: businessplanner-api
          token: ${{ secrets.CAPROVER_APP_TOKEN_BACKEND }}
          branch: main
          path: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy frontend to CapRover
        uses: caprover/deploy-from-github@v1.1.2
        with:
          server: ${{ secrets.CAPROVER_SERVER }}
          app: businessplanner-web
          token: ${{ secrets.CAPROVER_APP_TOKEN_FRONTEND }}
          branch: main
          path: frontend
```

### GitHub Secrets to Configure

| Secret | Description |
|--------|-------------|
| `CAPROVER_SERVER` | CapRover URL (e.g., `https://captain.yourdomain.com`) |
| `CAPROVER_APP_TOKEN_BACKEND` | App token for `businessplanner-api` (from CapRover UI > Deployment) |
| `CAPROVER_APP_TOKEN_FRONTEND` | App token for `businessplanner-web` (from CapRover UI > Deployment) |

### Generating App Tokens

1. Go to CapRover web UI > your app > "Deployment".
2. Under "Method 3: Deploy from Github", click "Enable App Token".
3. Copy the generated token and add it to GitHub Secrets.

---

## Post-Deployment Checklist

1. Verify health endpoint: `curl https://businessplanner-api.yourdomain.com/api/health`
2. Run database migrations if not automated.
3. Seed initial data (badges, admin user) if first deployment.
4. Verify frontend loads: `https://businessplanner-web.yourdomain.com`
5. Test login/registration flow end-to-end.
6. Verify HTTPS is active on both apps.
7. Check CORS is configured correctly (frontend can call backend).
8. Monitor logs: CapRover UI > app > "App Logs".
