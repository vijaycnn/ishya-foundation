FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package.json ./

RUN npm install --force
COPY ./ ./

RUN DT_NODEJS_DISABLE=1 DT_DISABLE_INSTRUMENTATION=true NODE_OPTIONS="" npm run build

CMD ["npm", "run", "start"]


# RUN npm ci
# # =========================
# # Stage 2: Build
# # =========================
# FROM node:20-bookworm-slim AS builder

# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules

# COPY . .

# # NEXT_PUBLIC_* variables are required during build
# ARG NEXT_PUBLIC_API_URL

# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# RUN npm run build


# # =========================
# # Stage 3: Production
# # =========================
# FROM node:20-bookworm-slim AS runner

# WORKDIR /app

# ENV NODE_ENV=production

# # Next.js application port
# ENV PORT=3001

# # Create non-root user
# RUN addgroup --system --gid 1001 nodejs \
#     && adduser --system --uid 1001 nextjs

# # Copy standalone Next.js output
# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3001

# CMD ["node", "server.js"]