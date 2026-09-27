# Finance Tracker

A MERN app for recording income and expenses and seeing where each month's money went.

- `backend/` Express, MongoDB, JWT auth, Zod validation, Cloudinary uploads, Swagger docs at `/docs`
- `frontend/` React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, axios

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and fill in the values.
2. Install and start both apps:

```bash
npm install
npm run install-all
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:3000

## Deploy

### Render (backend and frontend)

1. Push this repo to GitHub.
2. In Render, choose **New > Blueprint** and select the repo. `render.yaml` creates two services.
3. Fill in the environment variables Render asks for:
   - `finance-tracker-api`: `MONGO_URI` (MongoDB Atlas), the three `CLOUDINARY_*` keys, and `RENDER_URL` (the API's Render URL)
   - `finance-tracker-web`: `VITE_API_URL` (the API's Render URL)

### Vercel (frontend only)

Import the repo, set the root directory to `frontend`, and add `VITE_API_URL` pointing to the deployed API. `frontend/vercel.json` handles page refreshes on app routes.
