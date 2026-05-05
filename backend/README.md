# Task Tracker — Backend API

A production-ready REST API built with Node.js, Express, TypeScript, and MongoDB.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Fill in your .env values (see below)
```

### Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `4000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs — use a long random string |
| `NODE_ENV` | `development` or `production` |
| `CORS_ORIGIN` | Allowed origin for CORS (default: `*`) |

### MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free M0 cluster
3. Create a database user with a password
4. Whitelist your IP address (or `0.0.0.0/0` for development)
5. Click "Connect" → "Connect your application" → copy the connection string
6. Paste it into `MONGO_URI` in your `.env`, replacing `<user>`, `<pass>`, and `<db>`

## Run

```bash
# Development (hot-reload)
npm run dev

# Production build
npm run build && npm start
```

## Deploy to Render

1. Create a new **Web Service** on [Render](https://render.com/)
2. Connect your GitHub repository
3. Set the following:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CORS_ORIGIN`
5. Deploy — Render will use `/api/health` to verify the service is up

> **Note:** In production, lock down `CORS_ORIGIN` to your mobile app's domain or remove the wildcard `*`.

## API Endpoints

Base path: `/api`

| Method | Path | Auth | Body | Success Response |
|---|---|---|---|---|
| `GET` | `/api/health` | No | — | `{ status: "ok" }` |
| `POST` | `/api/auth/signup` | No | `{ name, email, password }` | 201 + `{ token, user }` |
| `POST` | `/api/auth/login` | No | `{ email, password }` | 200 + `{ token, user }` |
| `GET` | `/api/tasks` | Yes | — | 200 + `{ tasks: Task[] }` |
| `POST` | `/api/tasks` | Yes | `{ title, description? }` | 201 + `{ task }` |
| `PATCH` | `/api/tasks/:id` | Yes | `{ title?, description?, completed? }` | 200 + `{ task }` |
| `DELETE` | `/api/tasks/:id` | Yes | — | 200 + `{ success: true }` |

### Error Responses

| Status | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token / wrong credentials |
| `404` | Task not found (or belongs to another user) |
| `409` | Duplicate email on signup |
| `500` | Internal server error |

## Project Structure

```
backend/
├── src/
│   ├── config/db.ts           — Mongoose connection
│   ├── models/User.ts         — User schema + comparePassword
│   ├── models/Task.ts         — Task schema
│   ├── middleware/auth.ts      — JWT verification
│   ├── middleware/errorHandler.ts — Centralized error responses
│   ├── validators/auth.schema.ts — Zod schemas for auth
│   ├── validators/task.schema.ts — Zod schemas for tasks
│   ├── controllers/auth.controller.ts
│   ├── controllers/task.controller.ts
│   ├── routes/auth.routes.ts
│   ├── routes/task.routes.ts
│   ├── utils/jwt.ts           — Sign / verify helpers
│   ├── utils/asyncHandler.ts  — Async error wrapper
│   ├── types/express.d.ts     — Request.userId type
│   ├── app.ts                 — Express app setup
│   └── server.ts              — Entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── requests.http
└── README.md
```
