# Virtual Clinic

A modern virtual clinic web application built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. Supports multilingual UI (Italian, English, Russian) and includes both patient and doctor flows.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **shadcn/ui**
- **React Router v6**
- **TanStack Query**
- **Framer Motion**
- **React Hook Form** + **Zod**

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Run tests
npm test

# Production build
npm run build
```

---

## Deploy to Vercel

### Option A – Vercel CLI (quickest)

```bash
npm i -g vercel
vercel        # follow prompts — framework auto-detected as Vite
vercel --prod # promote to production
```

### Option B – Vercel Dashboard (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel will auto-detect the Vite framework and use the settings in `vercel.json`.
4. Click **Deploy** — done.

The `vercel.json` in this repo handles SPA client-side routing and asset caching automatically.

### Option C – GitHub Actions auto-deploy

Add the following secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Project settings or `vercel env pull` |
| `VERCEL_PROJECT_ID` | Project Settings → General |

Once set, every push to `main`/`master` triggers `.github/workflows/deploy.yml` which builds and deploys to Vercel production automatically.

---

## Project Structure

```
src/
├── components/
│   ├── doctor/        # Doctor-facing UI components
│   └── user/          # Patient-facing UI components
│       └── ui/        # shadcn/ui primitives
├── pages/
│   ├── doctor/        # Doctor portal pages
│   └── user/          # Patient portal pages
├── data/              # Mock data
├── hooks/             # Custom React hooks
├── i18n/              # Translations & i18n context
├── lib/               # Utilities
└── App.tsx            # Root router
```

---

## Environment Variables

No environment variables are required for the base app. If you add a backend or API keys, create a `.env.local` file (never commit this):

```env
VITE_API_URL=https://your-api.example.com
```

All Vite env vars must be prefixed with `VITE_` to be exposed to the browser.

---

## CI / CD

- `.github/workflows/ci.yml` — runs type check, lint, tests, and build on every push and pull request.
- `.github/workflows/deploy.yml` — deploys to Vercel production on every push to `main`/`master` (requires secrets above).
