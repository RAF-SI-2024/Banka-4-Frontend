FROM harbor.k8s.elab.rs/banka-4/node:22 AS builder

WORKDIR /app
COPY package.json package-lock.json .

RUN npm ci

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG API_BASE=/api

COPY . .
RUN NEXT_PUBLIC_API_BASE=${API_BASE} \
    npm run build

FROM harbor.k8s.elab.rs/banka-4/node:22

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN useradd prod

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
# TODO(arsen): public, if we end up using it
# COPY --from=builder /app/public /app/public
WORKDIR /app
ENV PORT=8080
CMD ["node", "server.js"]
