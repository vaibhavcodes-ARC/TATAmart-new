# G-Mart Enterprise B2B Marketplace

Welcome to the official Enterprise iteration of G-Mart. This codebase contains a complete Next.js TypeScript Frontend and a scalable Laravel 11 RESTful Backend supporting advanced marketplace transactional flow.

## 🚀 Quick Start Guide (Recommended: Docker)

Launch the full unified ecosystem (Frontend, Backend, and Databases) with a single command. Ensure Docker Desktop is running, then execute:

```bash
docker-compose up -d --build
```
Once completed, access frontend at `localhost:3000` and backend at `localhost:8000`.

---

## 💻 Native Setup Guide (Alternative: Without Docker)

If you prefer running natively on Windows/macOS using XAMPP or local PHP:

### 1. Backend Deployment
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```
*   Create a database named `tatamart_db` in your local MySQL/XAMPP.
*   Update `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` inside `.env` to match your local setup.
*   Then run:
```bash
php artisan migrate --seed
php artisan serve
```

### 2. Frontend Deployment
```bash
cd frontend
npm install
npm run dev
```
*   Open `src/utils/api.ts` and verify `API_BASE_URL` matches your active backend address.

## 🌐 Operational Access Points

| Service | Local Endpoint | Component |
| :--- | :--- | :--- |
| **Frontend UI** | [http://localhost:3000](http://localhost:3000) | Next.js App Router |
| **REST Backend** | [http://localhost:8000](http://localhost:8000) | Laravel 11 API |
| **Admin DB Panel** | [http://localhost:8080](http://localhost:8080) | phpMyAdmin Control |
| **MariaDB Core** | localhost:3306 | Primary RDBMS |

## 🏗️ Technical Architecture Breakdown

- **Frontend**: Next.js v16+, TypeScript, TailwindCSS v4, Framer Motion (subtle animations), Zustand (State Management), Axios.
- **Backend**: PHP 8.2+, Laravel 11, JWT Authentication, Real-time WebSockets (Reverb/Pusher), API Request Validators.
- **Infrastructure**: Service-Repository Architecture for clean code scalability, transactional isolation handlers for atomic order processing.

## 🛠️ Maintenance Cheat-Sheet

Run migrations inside the active container grid:
```bash
docker-compose exec backend php artisan migrate
```

Clear caches dynamically:
```bash
docker-compose exec backend php artisan optimize:clear
```

Enjoy building the future of B2B commerce!

---

## 📦 Non-Docker Deployment (Detailed)
If you prefer a simple host/server deployment without Docker, follow these steps.

### 1) Database
Create DB and user (example):
```sql
CREATE DATABASE tatamart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tatamart_user'@'localhost' IDENTIFIED BY 'tatamart_pass';
GRANT ALL PRIVILEGES ON tatamart_db.* TO 'tatamart_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2) Backend (Laravel)
Run these from the `backend/` folder:
```bash
cd backend
composer install --no-interaction --prefer-dist
cp .env.example .env
# edit .env to set DB_* and APP_URL
php artisan key:generate
php artisan storage:link
php artisan migrate
# seed only product data to avoid duplicate-user/category errors
php artisan db:seed --class=ProductSeeder
# development server (not for production)
php artisan serve --host=0.0.0.0 --port=8000
```

### 3) Frontend (Next.js)
From the `frontend/` folder:
```bash
cd frontend
npm ci
# set API url before build
# Linux/macOS
export NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run build
npm run start

# Windows PowerShell
$env:NEXT_PUBLIC_API_URL='http://localhost:8000/api'; npm run build; npm run start
```

If port 3000 is occupied you can run `next start` on a different port by setting `PORT` env var (example for Windows PowerShell):
```powershell
cd frontend
$env:PORT='3001'; npm run start
# or use cross-env: npx cross-env PORT=3001 npm run start
```

### 4) Quick checklist
- [ ] DB created and credentials set
- [ ] Backend `.env` configured and `composer install` run
- [ ] `php artisan migrate` ran successfully
- [ ] `ProductSeeder` applied (non-destructive)
- [ ] Frontend `npm run build` and `npm run start` verified

### 5) Production notes (short)
- Use `composer install --no-dev --optimize-autoloader` and serve PHP via `php-fpm` + nginx.
- Serve Next behind nginx or use a platform (Vercel/Netlify) and enable TLS.
- Replace development secrets and set `APP_ENV=production`, `APP_DEBUG=false`.

For a step-by-step deployment guide see `DEPLOYMENT.md` in the repository.
