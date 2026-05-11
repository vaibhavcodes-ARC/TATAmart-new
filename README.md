# TATAmart Enterprise B2B Marketplace

Welcome to the official Enterprise iteration of TATAmart. This codebase contains a complete Next.js TypeScript Frontend and a scalable Laravel 11 RESTful Backend supporting advanced marketplace transactional flow.

## 🚀 Quick Start Guide

Launch the full unified stack (Frontend, Backend, and Database) simultaneously using Docker Compose:

```bash
# Ensure Docker daemon is active
docker-compose up -d --build
```

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
