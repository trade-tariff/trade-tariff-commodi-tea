FROM node:22.4-alpine3.20 AS builder
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app/

RUN yarn run build

FROM node:22.4-alpine3.20
WORKDIR /app

COPY REVISION package.json yarn.lock /app/

RUN yarn install --frozen-lockfile --production && \
  apk add --no-cache postgresql-client libpq-dev

COPY --from=builder /app/dist /app/dist
COPY public /app/public
COPY views /app/views/
COPY .sequelizerc /app/.sequelizerc
COPY src/data/descriptions.json /app/dist/src/data/descriptions.json
COPY src/config/descriptionSampling.yaml /app/dist/src/config/descriptionSampling.yaml

RUN addgroup -S tariff && \
  adduser -S tariff -G tariff && \
  chown -R tariff:tariff /app
USER tariff

ENV PORT=8080 \
  NODE_ENV=production

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD ["yarn", "run", "start"]
