# Codex Task Manager — Simple Full-Stack Starter

A simple learning project using:

- Angular (standalone components)
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing

## Structure

```text
codex-task-manager/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/app/
    │   ├── core/
    │   │   ├── auth.service.ts
    │   │   ├── auth.guard.ts
    │   │   └── auth.interceptor.ts
    │   ├── models/
    │   ├── pages/
    │   │   ├── home/
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── project/
    │   │   └── user/
    │   ├── components/
    │   │   └── header/
    │   ├── app.routes.ts
    │   ├── app.config.ts
    │   └── app.ts
    └── src/styles.css
    └── package.json
```

## Requirements

Install these first:

- Node.js
- MongoDB Community Server running locally
- Angular CLI (optional; the project already has Angular dependencies)

## 1. Start MongoDB

Make sure your local MongoDB server is running.

The default connection is:

```text
mongodb://127.0.0.1:27017/codex_task_manager
```

## 2. Backend

Open a terminal:

```bash
cd backend
npm install
```

Create `.env` from `.env.example`.

On Windows PowerShell:

```powershell
copy .env.example .env
```

Then start:

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

## 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Open:

```text
http://localhost:4200
```

## What is implemented?

### Public
- Home page
- Project list
- Search projects
- Project details
- Project members
- Project tasks

### Authentication
- Register
- Login
- Logout
- JWT stored in localStorage
- Protected user dashboard
- HTTP interceptor automatically sends JWT

### User area
- See your projects
- Create projects
- Delete your projects
- Create tasks inside your projects
- Delete tasks
- Change task status
- Assign tasks to project members

## Intentionally NOT implemented yet

- Admin dashboard
- Admin user management
- Refresh tokens
- Password reset
- File uploads
- Deployment
- Advanced validation

This is intentionally kept small so you can understand every part before adding complexity.
