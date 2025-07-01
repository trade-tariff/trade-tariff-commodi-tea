ARG NODE_VERSION=24
ARG ALPINE_VERSION=3.22

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile && apk add --no-cache make bash

COPY . /app/

RUN make build

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production

WORKDIR /app

COPY REVISION package.json yarn.lock /app/

RUN yarn install --frozen-lockfile --production && \
  apk add --no-cache postgresql-client libpq-dev

COPY --from=builder /app/dist /app/dist
COPY public /app/public
COPY views /app/views/
COPY .sequelizerc /app/.sequelizerc

RUN addgroup -S tariff && \
  adduser -S tariff -G tariff && \
  chown -R tariff:tariff /app
USER tariff

ENV PORT=8080 \
  NODE_ENV=production

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD ["yarn", "run", "start"]
