# Examination Platform client (API v2)

    npm install
    npm run dev      # http://localhost:5173

Defaults to the production API. To use another backend, copy `.env.example` to `.env` and set `VITE_API_URL`.
The first request after idle can take 30-50s (Render cold start); the app shows a banner while it waits.
