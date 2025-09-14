# Second Brain — Frontend (Phase 0)

Next.js app for capturing, organizing, and recalling content into “Brains” (smart folders). Uses NextAuth for auth, HeroUI for UI, and tag-based revalidation for fast UX.

## Tech Stack

- Next.js 15 (App Router), React 19
- NextAuth (GitHub, Google, Credentials)
- HeroUI + Tailwind utilities
- Zod for validation

## Project Structure

```
second-brain-FE/
├─ src/
│  ├─ actions/           # Server actions (auth, brain, items)
│  ├─ api/               # Server-only API helpers (be/beJSON)
│  ├─ app/               # App Router pages, layouts, components
│  │  ├─ api/auth/[...nextauth]/route.ts  # NextAuth handler
│  │  ├─ components/     # UI components (TopNav, Sidebar, forms)
│  │  └─ dashboard/      # Authenticated pages
│  ├─ types/             # Shared types
│  ├─ util/              # be/beJSON/beWrite and helpers
│  └─ hero.ts            # HeroUI Tailwind preset
├─ public/               # Static assets
├─ next.config.ts        # Next.js config
├─ tsconfig.json         # Path alias: @/* -> ./src/*
├─ package.json          # Scripts and deps
└─ .env(.local)          # FE env variables (see below)
```

## Environment Variables

Create `.env.local` (or use your secrets setup) with:

- `NEXT_PUBLIC_API_URL` — Base URL of the backend API (e.g. http://localhost:3001)
- `GITHUB_ID`, `GITHUB_SECRET` — OAuth credentials
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth credentials
- `FE_JWS_PRIVATE_PEM` — PKCS8 private key (ES256) for OAuth exchange assertion
- `FE_JWS_ISS` — Issuer for FE assertion (default: `second-brain-web`)
- `FE_JWS_AUD` — Audience for FE assertion (default: `second-brain-be`)

Never commit private keys or secrets.

## Running Locally

Prereqs: Node 18+ recommended.

- Install deps: `npm install`
- Dev server: `npm run dev` → http://localhost:3000
- Lint: `npm run lint`
- Build: `npm run build`
- Start: `npm run start`

## Conventions

- Server-only fetch helpers in `src/util/be.ts`:
  - `be(path, opts)` → fetch with auth, retries, cache tags
  - `beJSON<T>(path, opts)` → `be()` + `res.json()`
  - `beWrite(path, body, { tagsToRevalidate })` → POST + revalidate tags
- API helpers (e.g. `src/api/brain-nav.ts`) use `beJSON` and tags like:
  - `brain-nav`, `all-tag`, `${brainId}:detail`, `${brainId}:all`, `${brainId}:count`
- Server actions under `src/actions/*` perform validations (Zod), call BE, and revalidate tags.
- App Router pages under `src/app/*` are server components by default; client components use "use client".

## Phase 0 — Completed

- Auth flows: GitHub/Google OAuth, credentials sign-in, refresh flow
- Token exchange via signed ES256 assertion (OAuth)
- Dashboard shell with responsive sidebar and top nav
- Sidebar brains list + sections; tag list from BE
- Create Brain modal (server action)
- Create Item form for multiple types (link, note, tweet, video, youtube, other)
- Tag-based cache revalidation for nav, lists, counts, and tags
- Theme switcher (light/dark)
- Basic search param wiring in TopNav
- Centralized BE fetch utilities (be/beJSON/beWrite)
- Frontend project flattened to repo root

## Phase 0 — TODOs

- Item lists and detail pages per section (tweets/videos/docs/links)
- Brain counts and details wired to BE (`${brainId}:count`, `${brainId}:detail`)
- Search and filtering on server for item lists
- Sharing: Wire share toggle/invite actions to BE
- Error/empty states polish and loading skeletons
- E2E smoke test for critical flows

## Notes

- Path alias `@/*` points to `src/*` (see `tsconfig.json`).
- Revalidation: writes should call `revalidateTag()` via `beWrite(..., { tagsToRevalidate })` or manually where needed.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start built app
- `npm run lint` — Lint sources
