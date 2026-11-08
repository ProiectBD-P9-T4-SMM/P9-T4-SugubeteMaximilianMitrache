# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1. Build the React/Vite single-page app.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS web
WORKDIR /app

# The SPA normally lives under the repository path on GitHub Pages. The
# container serves it from the site root, so the demo build passes "/" here.
ARG VITE_BASE=/
ARG VITE_API_URL=
ENV VITE_BASE=$VITE_BASE \
    VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY index.html vite.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

# ---------------------------------------------------------------------------
# 2. Runtime: Express API + the static build, one process.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend \
 && npm ci --omit=dev --no-audit --no-fund \
 && npm cache clean --force

COPY backend/src ./backend/src
COPY --from=web /app/dist ./frontend-dist
COPY demo/uploads ./uploads

# The app writes backups and newly uploaded documents next to backend/.
RUN mkdir -p /app/backend/backups /app/uploads \
 && chown -R node:node /app

USER node
EXPOSE 8080

ENV PORT=8080 \
    SERVE_FRONTEND=1 \
    FRONTEND_DIR=/app/frontend-dist

CMD ["node", "backend/src/server.js"]
