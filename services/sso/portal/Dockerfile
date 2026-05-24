# syntax=docker/dockerfile:1.7
# Production Next.js — built at image creation; use Dockerfile.dev for local dev.


FROM node:20-alpine
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY
ARG NODE_OPTIONS=--max-old-space-size=2048
ENV NODE_OPTIONS=${NODE_OPTIONS}

WORKDIR /build/sso
COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --prefer-offline --no-audit --no-fund

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY . .

RUN npx next build --turbopack

EXPOSE 3000
CMD ["npx", "next", "start"]
