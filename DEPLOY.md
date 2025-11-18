Deploying the project
=====================

This document describes deploying the client to Vercel and the server to Render (recommended). It assumes the repository root contains `client/` and `server/` directories.

1) Prep (local verification)

- Install dependencies and run locally to verify everything works:

  Server:
  ```powershell
  cd server
  npm install
  # create a local .env from .env.example and fill values
  copy .env.example .env
  # edit .env and set MONGO_URI and JWT_SECRET
  npm run dev
  ```

  Client:
  ```powershell
  cd client
  npm install
  # set client env locally if needed
  copy .env.example .env
  npm run dev
  # or build for production
  npm run build
  ```

2) Deploy client to Vercel

- In the Vercel dashboard, create a new project and import this Git repository.
- Set the "Root Directory" to `client` (so Vercel builds the frontend only).
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables (set in Vercel project settings):
  - `VITE_API_URL` -> `https://<your-render-server-url>/api`
  - `VITE_SOCKET_URL` -> `https://<your-render-server-url>`

- Deploy. After deploy completes you'll get a Vercel URL for the frontend (e.g. `https://my-app.vercel.app`).

3) Deploy server to Render

- In Render, create a new Web Service from the same Git repository.
- Set the "Root Directory" to `server` (so Render builds and runs the backend code).
- Build Command: `npm install`
- Start Command: `npm start` (or `node server.js`)
- Environment variables (set in Render service settings):
  - `MONGO_URI` -> your production MongoDB connection string
  - `JWT_SECRET` -> a strong secret
  - `NODE_ENV` -> `production`
  - `CLIENT_URL` -> the Vercel frontend URL (e.g. `https://my-app.vercel.app`)

Notes:
- Render will provide a service URL (e.g. `https://my-server.onrender.com`). Use that URL when setting `VITE_API_URL` and `VITE_SOCKET_URL` on Vercel.
- The server uses `CLIENT_URL` for CORS and socket origins; set it to your Vercel URL.
- If you prefer to serve the built client from the server instead of separate deployments, let me know and I can add an Express static middleware to serve `client/dist` in production.

4) Post-deploy checks

- Verify the frontend can hit the API: open browser console and check network requests to your Render API.
- Check socket connections: open browser console and connect to socket events; server logs should show socket connects on Render.
- Verify environment variables are present on both platforms (Vercel & Render) and that `MONGO_URI` is correct.

5) Optional: purge large files from git history

- If you accidentally committed `node_modules` or other large binary files, the index removal helps future commits but history still contains them. Use BFG or `git filter-repo` to purge them if you need to shrink repo size. I can prepare a safe plan if required.

If you want, I can:
- Add a small Express snippet to `server/server.js` to serve the client build when `NODE_ENV==="production"`.
- Run `npm install` and `npm run build` here and test the server locally.
