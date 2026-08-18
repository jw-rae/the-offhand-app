# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SITE_URL
ARG AZURE_STORAGE_BASE_URL
ARG AZURE_STORAGE_CONNECTION_STRING
ARG AZURE_STORAGE_CONTAINER_NAME
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV AZURE_STORAGE_BASE_URL=$AZURE_STORAGE_BASE_URL
ENV AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING
ENV AZURE_STORAGE_CONTAINER_NAME=$AZURE_STORAGE_CONTAINER_NAME

RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p public/media && chown -R nextjs:nodejs public/media

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
