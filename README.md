# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript. Manage your sales pipeline with filtering, search, role-based access control, CSV export, and dark mode.

---

## ✨ Features

### Core
- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Lead CRUD** — Create, read, update, delete leads with full validation
- **Advanced Filtering** — Filter by status, source, search by name/email, sort by date
- **Backend Pagination** — 10 leads per page with full metadata
- **Role-Based Access Control** — Admin (full access) vs Sales User (own leads only)
- **CSV Export** — Export filtered leads to CSV in one click
- **Debounced Search** — 400ms debounce on all search inputs
- **Dark / Light Mode** — Toggle with persistence via localStorage

### Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, Zustand, React Router v6 |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Containerization | Docker + Docker Compose |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas URI)
- npm

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/gigflow.git
cd gigflow

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** — copy and fill in values:
```bash
cd backend
cp .env.example .env
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy and fill in values:
```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data (optional)

```bash
cd backend
npm run seed
```

This creates:
- **Admin:** `admin@gigflow.com` / `Admin@123`
- **Sales:** `sales@gigflow.com` / `Sales@123`
- 20 sample leads

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Setup

```bash
# From the root gigflow/ directory
cp backend/.env.example backend/.env   # fill in your values

# Build and start all services
docker-compose up --build

# Seed demo data inside container (optional)
docker-compose exec backend node dist/scripts/seed.js
```

Services:
- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost:5000](http://localhost:5000)
- MongoDB: `mongodb://localhost:27017`

---

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Business logic (auth, leads)
│   │   ├── middleware/       # Auth, error handler, validators
│   │   ├── models/           # Mongoose schemas (User, Lead)
│   │   ├── routes/           # Express route definitions
│   │   ├── scripts/          # Seed script
│   │   ├── types/            # TypeScript interfaces & enums
│   │   └── index.ts          # App entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios API layer (auth.ts, leads.ts, client.ts)
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Zustand stores (auth, theme)
│   │   ├── hooks/            # Custom hooks (useLeads, useDebounce)
│   │   ├── pages/            # Page components (Dashboard, Login, Register)
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔐 Role-Based Access Control

| Action | Admin | Sales User |
|---|---|---|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit any lead | ✅ | ❌ (own only) |
| Delete any lead | ✅ | ❌ (own only) |
| Export CSV | ✅ | ✅ (own leads) |
| View stats | ✅ | ✅ (own leads) |

---

## 📡 API Reference

See `API.md` for full endpoint documentation.

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |

### Leads
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/leads` | Get paginated leads with filters | ✅ |
| POST | `/leads` | Create lead | ✅ |
| GET | `/leads/:id` | Get single lead | ✅ |
| PUT | `/leads/:id` | Update lead | ✅ |
| DELETE | `/leads/:id` | Delete lead | ✅ |
| GET | `/leads/stats` | Get lead stats | ✅ |
| GET | `/leads/export` | Export CSV | ✅ |

---

## 🛠️ TypeScript

- Strict mode enabled throughout
- All models have proper interfaces (no implicit `any`)
- Enums for `LeadStatus`, `LeadSource`, `UserRole`
- Shared types between controllers, middleware, and routes
- Frontend types mirror backend contracts

---

## 📝 Git Commit Convention

```
feat: add CSV export functionality
fix: correct pagination skip calculation
chore: add Docker multi-stage build
refactor: extract lead filter builder to helper
```
