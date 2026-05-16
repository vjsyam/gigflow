# GigFlow — Smart Leads Dashboard

GigFlow is a full-stack Lead Management Dashboard built using the MERN stack with TypeScript.
The project focuses on practical sales workflow management with authentication, role-based access control, filtering, pagination, CSV export, and responsive UI support.

This project was developed as part of the ServiceHive Full Stack Internship Assignment.

---

## 🌐 Live Demo

Frontend: https://gigflow-rho-rose.vercel.app
Backend API: https://gigflow-om6b.onrender.com

---

## 🎥 Demo Video

Loom Walkthrough: https://www.loom.com/share/cc0b00d93c0945fabf6f84da46588c34

---

# ✨ Features

## Authentication

* JWT-based authentication
* User registration & login
* Protected routes
* Password hashing using bcrypt
* Persistent login sessions

## Leads Management

* Create leads
* Update leads
* Delete leads
* View individual lead details
* Paginated leads dashboard

## Filtering & Search

* Filter by lead status
* Filter by lead source
* Search by name or email
* Sort by latest or oldest
* Multiple filters work together
* Debounced search for reduced API calls

## Role-Based Access Control

### Admin

* Access all leads
* Edit/delete any lead
* Export all leads

### Sales User

* Access only assigned leads
* Edit/delete own leads
* Export own leads

## Additional Features

* CSV export
* Dark / Light mode
* Responsive dashboard UI
* Loading states
* Empty states
* Error handling UI
* Form validation
* Docker support

---

# 🛠️ Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Frontend         | React 18, TypeScript, TailwindCSS |
| State Management | Zustand                           |
| Backend          | Node.js, Express.js, TypeScript   |
| Database         | MongoDB + Mongoose                |
| Authentication   | JWT + bcryptjs                    |
| Deployment       | Docker + Docker Compose           |

---

# 💡 Implementation Notes

Some implementation decisions made during development:

* Zustand was used instead of Context API to simplify auth and theme state management.
* Backend filtering and pagination are query-based for easier frontend state synchronization.
* Debounced search was implemented to avoid unnecessary API requests while typing.
* CSV export respects active filters and role permissions.
* Docker support was added to make local setup and deployment more consistent.

---

# ⚙️ Challenges Faced

Some challenges during development included:

* Synchronizing filters with pagination state
* Managing RBAC cleanly across frontend and backend
* Keeping TypeScript interfaces consistent throughout the application
* Preventing unnecessary re-renders during live search
* Handling API error states gracefully

---

# 🚀 Quick Start

## Prerequisites

Make sure you have installed:

* Node.js (v20+ recommended)
* MongoDB (local or Atlas)
* npm

---

# 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/gigflow.git
cd gigflow
```

---

# 2. Install Dependencies

## Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd ../frontend
npm install
```

---

# 3. Environment Setup

## Backend

Copy `.env.example` and create `.env`

```bash
cd backend
cp .env.example .env
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Frontend

```bash
cd frontend
cp .env.example .env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 4. Seed Demo Data (Optional)

```bash
cd backend
npm run seed
```

Demo Accounts:

### Admin

```txt
Email: admin@gigflow.com
Password: Admin@123
```

### Sales User

```txt
Email: sales@gigflow.com
Password: Sales@123
```

This will also generate sample leads.

---

# 5. Run Development Servers

## Backend

```bash
cd backend
npm run dev
```

## Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

# 🐳 Docker Setup

From the project root:

```bash
docker-compose up --build
```

Optional seed command:

```bash
docker-compose exec backend node dist/scripts/seed.js
```

---

# 📁 Project Structure

```txt
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── types/
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# 🔐 Role Permissions

| Action          | Admin | Sales User |
| --------------- | ----- | ---------- |
| View all leads  | ✅     | ❌          |
| View own leads  | ✅     | ✅          |
| Create leads    | ✅     | ✅          |
| Edit any lead   | ✅     | ❌          |
| Edit own lead   | ✅     | ✅          |
| Delete any lead | ✅     | ❌          |
| Delete own lead | ✅     | ✅          |
| Export CSV      | ✅     | ✅          |

---

# 📡 API Overview

Base URL:

```txt
http://localhost:5000/api
```

## Auth Routes

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |
| GET    | /auth/me       |

---

## Lead Routes

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /leads        |
| POST   | /leads        |
| GET    | /leads/:id    |
| PUT    | /leads/:id    |
| DELETE | /leads/:id    |
| GET    | /leads/stats  |
| GET    | /leads/export |

Detailed endpoint documentation is available in `API.md`.

---

# 📸 Screenshots

Add screenshots here:

* Login Page
* Dashboard
* Lead Management
* Filters & Search
* Dark Mode
* Mobile View

---

# 🧪 TypeScript Usage

* Strict mode enabled
* Proper interfaces for models and API responses
* Enums used for lead status, source, and user roles
* Shared type safety across frontend and backend
* Minimal usage of `any`

---

# 📝 Git Commit Convention

Example commit messages used during development:

```bash
feat: implement JWT authentication
feat: add lead CRUD APIs
feat: implement advanced filtering
feat: add debounced search
feat: implement RBAC permissions
feat: add CSV export functionality
fix: correct pagination metadata issue
fix: handle token expiration properly
refactor: extract reusable modal component
refactor: optimize filter query builder
style: improve responsive dashboard layout
chore: add Docker configuration
docs: update README setup instructions
```

---

# 🚧 Future Improvements

Possible future enhancements:

* Real-time lead updates using WebSockets
* Lead activity timeline/history
* Email notifications
* Unit & integration testing
* Analytics dashboard
* Team collaboration features

---

# 📌 Note

This project was built for the ServiceHive Full Stack Internship Assignment with a focus on clean architecture, scalability, maintainability, and practical real-world workflow implementation.
