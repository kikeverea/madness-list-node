# ---- build stage ----
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:20-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

# (optional) migrations/seeders/static files
# COPY --from=build /usr/src/app/migrations ./migrations

USER node

CMD ["node", "dist/index.js"]