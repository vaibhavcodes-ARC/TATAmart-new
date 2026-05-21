# DEPLOYMENT GUIDE — TATAmart-new

This document explains a simple, non-Docker deployment for local or server use and includes a task checklist you can tick on GitHub.

## Overview
- Frontend: Next.js app (production served with `next start`)
- Backend: Laravel app (PHP 8.2+, served with `php-fpm`/`php artisan serve` for testing)
- Database: MariaDB / MySQL

---

## Checklist (GitHub task list)
- [ ] Create database and user
- [ ] Configure backend `.env` and run `composer install`
- [ ] Generate fresh `APP_KEY` and `JWT_SECRET`
- [ ] Run backend migrations (non-destructive)
- [ ] Run seeders
- [ ] Build frontend (`npm run build`)
- [ ] Start backend and frontend services
- [ ] Smoke test common endpoints
- [ ] Configure process manager (PM2 / systemd) for production

> Tip: On GitHub you can tick these boxes to track progress.

---

## Prerequisites (server or local machine)
- Node.js (>=18) and npm
- PHP 8.2+ and Composer
- MariaDB / MySQL server
- Git

---

## Database (example)
Run these SQL commands in your MySQL/MariaDB client (adjust host and auth as needed):

```sql
CREATE DATABASE tatamart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tatamart_user'@'localhost' IDENTIFIED BY 'tatamart_pass';
GRANT ALL PRIVILEGES ON tatamart_db.* TO 'tatamart_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Backend (Laravel) — quick commands
Run from repository `backend/` folder.

```bash
cd backend
composer install --no-interaction --prefer-dist
cp .env.example .env
# Edit .env to match DB credentials and set APP_URL
php artisan key:generate
php artisan jwt:secret
php artisan optimize:clear
php artisan storage:link
# Run migrations (non-destructive)
php artisan migrate
php artisan db:seed
# Quick test server (development only)
php artisan serve --host=0.0.0.0 --port=8000
```

Notes:
- The bundled category and user seeders are idempotent, so repeated deploys should not fail on duplicate emails or slugs.
- Never deploy with values from `backend/.env`; generate fresh secrets for the server.
- For production, use `composer install --no-dev --optimize-autoloader` and serve via php-fpm + nginx.

---

## Docker Compose deployment
Copy the deploy env template and fill every secret before building:

```bash
cp .env.deploy.example .env
docker compose build
docker compose up -d mariadb
docker compose run --rm backend php artisan migrate --force
docker compose run --rm backend php artisan db:seed --force
docker compose up -d
```

If authentication reports `JWT_SECRET` problems after changing env values, clear Laravel's cached runtime config:

```bash
docker compose exec backend php artisan optimize:clear
```

---

## Frontend (Next.js) — quick commands
Run from repository `frontend/` folder.

Before building, export your backend API URL to the `NEXT_PUBLIC_API_URL` env var:

```bash
# Linux/macOS
export NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm ci
npm run build
npm run start

# Windows PowerShell
$env:NEXT_PUBLIC_API_URL='http://localhost:8000/api'; npm ci; npm run build; npm run start
```

- `npm run start` runs the compiled Next server (`next start`) and listens on port 3000 by default.
- For background process management use `pm2` or `systemd`.

---

## Smoke tests
- Frontend: open http://localhost:3000
- Backend: open http://localhost:8000 or call API: `curl http://localhost:8000/api/products`

---

## Production recommendations (short)
- Use nginx as reverse proxy and `php-fpm` for Laravel.
- Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`.
- Use TLS (Let's Encrypt) and secure JWT/secret values.
- Use `pm2` or `systemd` to manage frontend (`next start`) and background workers (queues).
- Configure log rotation and monitoring.

---

## Helpful snippets
Example `systemd` unit for frontend (adjust `WorkingDirectory` and `User`):

```ini
[Unit]
Description=TATAmart Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/TATAmart-new/frontend
Environment=NEXT_PUBLIC_API_URL=http://localhost:8000/api
ExecStart=/usr/bin/npm run start
Restart=always

[Install]
WantedBy=multi-user.target
```

Example `nginx` server block (frontend + proxy to Laravel API):

```
server {
  listen 80;
  server_name your.domain.com;

  root /path/to/TATAmart-new/frontend/.next;

  location /_next/static/ {
    alias /path/to/TATAmart-new/frontend/.next/static/;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## Troubleshooting
- If `npm run build` fails: inspect TypeScript/ESLint output, fix errors. This repo aims to be buildable after recent fixes.
- If migrations fail due to duplicates: run only non-destructive migrations or seed only `ProductSeeder`.
- If Laravel needs extensions (sodium, gd, zip), install them on the host or use a proper PHP image.

---

## Want me to do this for you?
I can:
- Run the backend/frontend setup commands here (where safe),
- Generate `systemd` or `pm2` unit files and an `nginx` config for your server,
- Or produce a one-shot deploy script.

Tell me which and I'll proceed.
