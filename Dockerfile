FROM node:22.4-alpine3.20 AS builder
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app/

RUN yarn run build

FROM node:22.4-alpine3.20
WORKDIR /app

COPY REVISION package.json yarn.lock /app/
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist /app/dist

COPY public /app/public
COPY sequelize /app/sequelize
COPY .env.development /app/.env.development
COPY .sequelizerc /app/.sequelizerc

RUN addgroup -S tariff && \
  adduser -S tariff -G tariff && \
  chown -R tariff:tariff /app
USER tariff

ENV PORT=8080 \
  NODE_ENV=production

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && yarn run start
