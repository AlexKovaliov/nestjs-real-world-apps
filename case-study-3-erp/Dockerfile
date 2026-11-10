ARG APP=hr

FROM node:24 AS builder
ARG APP
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build ${APP}

FROM node:24
ARG APP
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV APP=${APP}
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
CMD ["sh", "-c", "exec node dist/apps/${APP}/main"]
