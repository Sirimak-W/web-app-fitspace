# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build — run this to verify no TS/lint errors
npm run lint     # ESLint
```

No test suite is configured.

## Stack

- **Next.js 16.2.9** (App Router) — see AGENTS.md; APIs differ from earlier versions
- **React 19.2.4** with TypeScript
- **Tailwind CSS v4** — CSS-first config; `@import "tailwindcss"` in `globals.css`, no `tailwind.config.js`
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`) for auth and database
- **Target deploy:** Vercel

## Next.js 16 breaking changes in use

- **`proxy.ts`** replaces `middleware.ts` — export `proxy` (not `middleware`); same `config` matcher export
- **`cookies()`** from `next/headers` is async — always `await cookies()`

## Supabase client pattern

- **Browser (client components):** `lib/supabase/client.ts` → `createBrowserClient`
- **Server (server components, actions, route handlers):** `lib/supabase/server.ts` → `createServerClient` with async `cookies()`
- Never use the browser client in server code or vice versa

## Auth flow

Magic link (passwordless). `signInWithOtp` → email → user clicks link → `GET /auth/callback` handles both PKCE (`code` param) and OTP (`token_hash` + `type` params) → redirect to `/dashboard`.

`proxy.ts` guards `/dashboard/*` (redirect to `/login` if no session) and `/login` (redirect to `/dashboard` if already authenticated).

## Data model

Single table `runs` in `schema.sql`:
- `user_id uuid` — RLS enforced; all four policies use `auth.uid() = user_id`
- `distance_km numeric(6,2)` — stored in km
- `duration_seconds integer` — UI accepts h/m/s and converts on save
- `date date`, `notes text` (nullable), `created_at timestamptz`

Pace is computed client-side (`duration_seconds / distance_km`), never stored.

## Route map

| Route | Type | Purpose |
|---|---|---|
| `/` | Server page | Auth check → redirect to `/dashboard` or `/login` |
| `/login` | Client page | Magic link request form |
| `/auth/callback` | Route handler | OTP/PKCE exchange, sets session cookie |
| `/dashboard` | Server page | Stats + run history table |
| `/dashboard/log` | Server page + Server Action | Log a run form |

## Env vars

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — see `.env.example`. Both are `NEXT_PUBLIC_` so they are safe to expose to the browser (anon key only).
