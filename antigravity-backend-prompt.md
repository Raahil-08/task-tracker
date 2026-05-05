# Antigravity Prompt — Task Tracker Backend

Paste the entire prompt below into Antigravity as your initial task. Do not strip sections — they're tuned to give you a deployment-ready backend in one shot.

---

You are scaffolding a production-ready Node.js + Express + TypeScript backend for a Task Tracker mobile app. The backend will be deployed to Render and called by an Expo / React Native mobile app. Build it with clarity, correctness, and minimal cleverness — this is for an internship evaluation, so the code must be readable.

## Tech Stack (mandatory)

- Node.js 20.x
- TypeScript (strict mode)
- Express 4.x
- MongoDB via Mongoose 8.x
- `bcrypt` for password hashing
- `jsonwebtoken` for JWT
- `zod` for request validation
- `cors`, `dotenv`, `helmet` for standard middleware
- `tsx` (or `ts-node-dev`) for dev, `tsc` for production build

Do NOT use Firebase, Supabase, NestJS, or any pre-built BaaS. Plain Express only.

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              ← Mongoose connection
│   ├── models/
│   │   ├── User.ts
│   │   └── Task.ts
│   ├── middleware/
│   │   ├── auth.ts            ← JWT verification
│   │   └── errorHandler.ts    ← centralized error responses
│   ├── validators/
│   │   ├── auth.schema.ts     ← zod schemas
│   │   └── task.schema.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── task.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── task.routes.ts
│   ├── utils/
│   │   └── jwt.ts             ← sign / verify helpers
│   ├── types/
│   │   └── express.d.ts       ← extend Request with userId
│   ├── app.ts                 ← express app setup
│   └── server.ts              ← entry point: connect DB, listen
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

**User**
- `name`: string, required, 2–60 chars
- `email`: string, required, unique, lowercase, validated as email
- `passwordHash`: string, required, never returned in JSON
- `createdAt`: timestamp (auto)

**Task**
- `userId`: ObjectId, ref `User`, required, indexed
- `title`: string, required, 1–200 chars, trimmed
- `description`: string, optional, max 1000 chars, trimmed
- `completed`: boolean, default false
- `createdAt` / `updatedAt`: timestamps (auto via `{ timestamps: true }`)

Configure both schemas with `toJSON: { transform }` to remove `__v` and rename `_id` to `id`. Never return `passwordHash`.

## API Endpoints

Base path: `/api`

| Method | Path | Auth | Body | Success Response |
|---|---|---|---|---|
| GET | `/api/health` | No | — | `{ status: "ok" }` |
| POST | `/api/auth/signup` | No | `{ name, email, password }` | 201 + `{ token, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | 200 + `{ token, user }` |
| GET | `/api/tasks` | Yes | — | 200 + `{ tasks: Task[] }` (newest first) |
| POST | `/api/tasks` | Yes | `{ title, description? }` | 201 + `{ task }` |
| PATCH | `/api/tasks/:id` | Yes | `{ title?, description?, completed? }` | 200 + `{ task }` |
| DELETE | `/api/tasks/:id` | Yes | — | 200 + `{ success: true }` |

## Authentication Logic

- Hash passwords with `bcrypt`, salt rounds = 10.
- JWT payload: `{ userId: string }`. Sign with `process.env.JWT_SECRET`. Expiry: `7d`.
- Auth middleware: read `Authorization: Bearer <token>` → verify → attach `req.userId` → call `next()`. On any failure (missing, malformed, invalid, expired): respond 401 `{ error: "Unauthorized" }`.
- Login error message must be generic ("Invalid email or password") — do not leak which field is wrong.
- Mongoose `User` model should expose a method `comparePassword(plain): Promise<boolean>`.

## Validation Rules (zod)

- **Signup:** `name` 2–60 chars, `email` valid email, `password` min 8 chars.
- **Login:** `email` valid email, `password` non-empty.
- **Create task:** `title` 1–200 chars required, `description` ≤ 1000 chars optional.
- **Update task:** all fields optional, but at least one must be present; same length limits.
- Validation failures return 400 with `{ error: "<first zod issue message>" }`.

## Error Handling

- Centralized `errorHandler` middleware as the last `app.use`.
- Common cases:
  - Validation error → 400
  - Missing/invalid token → 401
  - Task not found OR belongs to another user → **404 with `{ error: "Task not found" }`** (don't distinguish, prevents enumeration)
  - Duplicate email on signup → 409 `{ error: "Email already in use" }`
  - Anything unexpected → 500 `{ error: "Internal server error" }` and `console.error` the actual error.
- Wrap async controller functions so thrown errors propagate to the handler. Use a small `asyncHandler` helper or express 5's native async support.

## Environment Variables (`.env.example`)

```
PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-long-random-string
NODE_ENV=development
CORS_ORIGIN=*
```

`server.ts` must fail fast at startup if `MONGO_URI` or `JWT_SECRET` is missing.

## Deployment Readiness

- `package.json` scripts:
  - `dev`: `tsx watch src/server.ts`
  - `build`: `tsc`
  - `start`: `node dist/server.js`
- Build outputs to `dist/`. `tsconfig.json` has `"outDir": "./dist"`, `"rootDir": "./src"`, `"strict": true`, `"esModuleInterop": true`, `"skipLibCheck": true`, `"target": "ES2022"`.
- App listens on `process.env.PORT || 4000`.
- CORS configured from `CORS_ORIGIN` env var (default `*` for take-home; mention in README this would be locked down in real production).
- `helmet()` enabled.
- Include a `/api/health` endpoint that returns `{ status: "ok" }` (used by Render to verify the service is up).

## Testing Expectations

No formal test suite required for this assignment. Instead:
- Include a `requests.http` file (or Postman collection JSON) at the backend root with example requests for every endpoint, including pre-filled signup/login that yields a token and authenticated task requests.
- Manually verify all happy paths and the key error paths (wrong password, no token, task not owned, duplicate email).

## README (`backend/README.md`)

Include:
- Setup: `npm install`, copy `.env.example` to `.env`, fill values
- Get a MongoDB connection string from Atlas (link to Atlas free-tier guide)
- Run: `npm run dev`
- Build + start: `npm run build && npm start`
- Deploy to Render: build command, start command, env vars to set
- Endpoint reference (table)

## Final Instructions

1. Generate the full project, every file, no placeholders.
2. Use clear, idiomatic TypeScript. Strict mode must compile cleanly with zero `any`.
3. Comment non-obvious decisions (why the auth middleware, why generic 404 for cross-user access).
4. After generating, list the exact commands I should run to install and start the backend locally.
