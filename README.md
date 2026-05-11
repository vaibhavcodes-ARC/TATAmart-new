# TATAmart Enterprise B2B Marketplace

Welcome to the official Enterprise iteration of TATAmart. This codebase contains a complete Next.js TypeScript Frontend and a scalable Laravel 11 RESTful Backend supporting advanced marketplace transactional flow.

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
