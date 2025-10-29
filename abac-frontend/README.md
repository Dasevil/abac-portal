# ABAC Frontend Dashboard

React + Vite + TypeScript dashboard for the ABAC backend (FastAPI + Casbin).

## Quickstart

```bash
cd abac-frontend
npm install
npm run dev
```

Defaults:
- API URL: `http://localhost:5000` (override with `VITE_API_URL`)
- Enforce path: `/auth` (override with `VITE_ENFORCE_PATH`)

Create `.env` (optional):

```
VITE_API_URL=http://localhost:5000
VITE_ENFORCE_PATH=/auth
```

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview build
- `npm run lint` – run ESLint

## Tech
- React 18, React Router
- Tailwind CSS
- Zustand
- Axios
- TanStack Query
- Recharts

## Notes
- The backend in this repository exposes `/auth` for document access checks. If your backend uses `/enforce`, set `VITE_ENFORCE_PATH=/enforce`.
- UI is defensive against undefined data and shows simple placeholders.
