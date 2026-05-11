# TataMart B2B Ecosystem

Welcome to TataMart, a futuristic, production-ready B2B marketplace engine designed for scalability and modular expansion.

## 🏗️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS 4.0, Framer Motion, Axios, React Hook Form.
- **Backend**: PHP Laravel (REST APIs), php-open-source-saver/jwt-auth.
- **Database**: MariaDB 10.11
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Running via Docker (Recommended)

Ensure Docker Desktop is launched and running on your system.

1. **Navigate to Project Root**:
   ```bash
   cd d:\Projects\TATAmart-new
   ```

2. **Build & Launch Containers**:
   ```bash
   docker-compose up --build
   ```

3. **Initialization (First Time Run Only)**:
   Once database is healthy, execute these in separate terminals:
   ```bash
   docker-compose exec backend php artisan migrate --seed
   ```

---

## 🌐 Access Gateways

| Interface | URL | Port |
|-----------|-----|------|
| **Frontend Web** | `http://localhost:3000` | 3000 |
| **Backend API** | `http://localhost:8000/api` | 8000 |
| **phpMyAdmin (DB Viewer)** | `http://localhost:8080` | 8080 |

---

## 🔑 Seeded Test Credentials

Utilize these predefined personas to validate flows instantly:

**Administrator**
- **Email**: `admin@tatamart.com`
- **Password**: `password123`

**Enterprise Seller**
- **Email**: `seller@tatamart.com`
- **Password**: `password123`

**Procurement Buyer**
- **Email**: `buyer@tatamart.com`
- **Password**: `password123`

---

## 📁 System Architecture

- `/frontend`: The Next.js visual application.
  - `src/contexts`: Application state and global sessions.
  - `src/services`: Persistent API connectors.
  - `src/app`: Routes and Page hierarchies.
- `/backend`: The Laravel application serving business-critical logical endpoints.
  - `app/Http/Controllers/Api`: Payload routing.
  - `database/migrations`: Relational integrity maps.
  - `routes/api.php`: Core API exposed surface.

---

## 🛠️ Local Manual Running (Alternative)

If you are not utilizing Docker:

**Backend**:
1. Configure `.env` for standard MariaDB/MySQL connection.
2. Inside `/backend`: `C:\xampp\php\php.exe artisan serve`

**Frontend**:
1. Inside `/frontend`: `npm run dev`

---

*Engineered with modular excellence for TataMart Enterprise Ecosystem.*
