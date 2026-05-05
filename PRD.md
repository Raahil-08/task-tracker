


## 1. Product Overview

A mobile task tracker. Authenticated users create, view, complete, and delete personal tasks. Each user's tasks are private. Native mobile UI built with Expo + React Native + TypeScript; data served by a custom Node/Express/MongoDB backend with JWT auth.

## 2. Problem Statement

Existing task apps either bury simple to-do lists under planner/calendar/team features, or require sign-up to a SaaS the user doesn't trust. This app demonstrates the smallest viable single-player task tracker with full-stack ownership: own backend, own auth, own data.

(Real reason: this is an internship assignment evaluating MERN + React Native fundamentals.)

## 3. Target Users

Individual users tracking their own work. Single-player. No teams, no sharing, no collaboration.

## 4. User Roles

One role: **Authenticated User**. Can do everything in scope. No admin role, no anonymous access (every endpoint except signup/login is protected).

## 5. Core Features (MVP)

| # | Feature | Notes |
|---|---|---|
| 1 | Sign up with name + email + password | Email unique, password hashed with bcrypt |
| 2 | Log in with email + password | Returns JWT |
| 3 | View list of own tasks | Newest first |
| 4 | Create a task with title (required) + description (optional) | Defaults to incomplete |
| 5 | Mark task complete / incomplete | Via PATCH |
| 6 | Delete a task | Hard delete |
| 7 | Pull-to-refresh on task list | Triggers TanStack Query refetch |
| 8 | Loading / empty / error UI states | Required by spec |

## 6. MVP Scope (must ship Friday)

Everything in section 5. Plus: deployed backend (Render), hosted DB (Atlas), demo video, README.

## 7. Out of Scope

- Edit task title/description (bonus — only if time)
- Filter completed/pending (bonus)
- Persist login session beyond app restart (bonus)
- Password reset / email verification
- OAuth / Google login
- Push notifications
- Recurring tasks, due dates, reminders
- Sharing, multi-user, teams
- Admin panel

## 8. User Flows

**Signup flow.** Open app → tap "Sign up" → enter name, email, password → tap submit → loading spinner → on success: token saved, redirect to task list (empty state). On error (email taken, weak password): inline error.

**Login flow.** Open app → "Log in" → enter email, password → submit → on success: token saved, redirect to task list. On error (wrong creds): inline error.

**Create task.** On task list → tap "+" or "Add task" → enter title, optional description → submit → optimistic update or refetch → new task appears at top of list.

**Toggle complete.** Tap checkbox / row → PATCH fires → UI updates (strikethrough or checkmark).

**Delete task.** Swipe or tap delete icon → confirm → DELETE fires → row removed.

**Pull-to-refresh.** Pull down on task list → refetch query → list reloads.

## 9. Functional Requirements

- All endpoints except `/auth/signup` and `/auth/login` require valid JWT in `Authorization: Bearer <token>` header.
- Tasks are scoped to `userId`. A user must never be able to read/modify another user's tasks.
- Passwords stored as bcrypt hash with salt rounds ≥ 10. Plain passwords never logged or returned.
- JWT signed with `JWT_SECRET`, expires in 7 days.
- Validation rejects bad input with 400 + clear error message.
- All errors return JSON: `{ error: "human-readable message" }`.

## 10. Non-Functional Requirements

- **Type safety:** TypeScript on frontend (mandatory per spec), recommended on backend.
- **Performance:** Task list fetch < 1s on Render warm instance.
- **Security:** Hashed passwords, signed JWTs, no sensitive data in logs.
- **Code quality:** Clear folder structure, no commented-out blocks, meaningful names.

## 11. Database Entities

**User**

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | auto |
| `name` | string | required, 2–60 chars |
| `email` | string | required, unique, lowercase, valid format |
| `passwordHash` | string | bcrypt hash, never returned |
| `createdAt` | Date | auto |

**Task**

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | auto |
| `userId` | ObjectId | ref to User, indexed |
| `title` | string | required, 1–200 chars |
| `description` | string | optional, ≤ 1000 chars |
| `completed` | boolean | default false |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

## 12. API Requirements

Base path: `/api` (or root — match the assignment spec).

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/signup` | No | `{ name, email, password }` | `{ token, user: { id, name, email } }` |
| POST | `/auth/login` | No | `{ email, password }` | `{ token, user: { id, name, email } }` |
| GET | `/tasks` | Yes | — | `{ tasks: Task[] }` |
| POST | `/tasks` | Yes | `{ title, description? }` | `{ task: Task }` |
| PATCH | `/tasks/:id` | Yes | `{ title?, description?, completed? }` | `{ task: Task }` |
| DELETE | `/tasks/:id` | Yes | — | `{ success: true }` |

All responses JSON. Errors: `{ error: string }` with appropriate HTTP status.

## 13. Authentication Requirements

- Signup hashes password with bcrypt (10+ rounds), inserts user, signs and returns JWT.
- Login looks up user by email, compares bcrypt hash, signs and returns JWT.
- JWT payload: `{ userId, iat, exp }`. Expiry: 7 days.
- Auth middleware: read `Authorization` header → strip `Bearer ` → verify with secret → attach `req.userId` → next. On failure: 401.
- All `/tasks` routes use the middleware.
- On the mobile app: token stored in `expo-secure-store`. On 401, clear token and redirect to login.

## 14. Admin Requirements

Out of scope.

## 15. Error States

- **Signup:** email already exists (409), validation failure (400).
- **Login:** wrong email/password (401, generic "invalid credentials" message — don't leak which field is wrong).
- **Auth middleware:** missing token (401), invalid token (401), expired token (401).
- **Task routes:** task not found (404), task belongs to another user (404 — same as not found, don't leak existence), validation error (400).
- **Network:** mobile app should show user-friendly message ("Couldn't reach server") on fetch failure.

## 16. Edge Cases

- Empty task list → mobile shows empty state ("No tasks yet — add your first one").
- Very long title (>200 chars) → backend rejects with 400.
- Token expired mid-session → mobile clears token, redirects to login.
- Duplicate signup email → 409 with clear message.
- Pull-to-refresh while already loading → ignore, no double-fetch.
- Render free tier cold start (~30s) → first request slow; mobile should show loading state, not error out.
- User toggles same task twice quickly → use optimistic update or disable button while mutation pending.

## 17. Success Metrics

For the assignment specifically — evaluation criteria:
- Backend correctness (routes, schema, validation work as specified)
- API design clarity
- Code structure and readability
- TypeScript usage
- UI handles loading, empty, error states
- Demo video shows the full flow working end-to-end
- README is clear enough that the evaluator can run it themselves

For the candidate (you):
- Can explain every architectural choice in the discussion round
- Hit the Friday noon deadline
