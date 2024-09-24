IMAGE_NAME := trade-tariff-commodi-tea
SHELL := /usr/bin/env bash

run: clean build
	source .env.development && yarn run start

test:
	yarn run ts-node node_modules/jasmine/bin/jasmine

clean:
	yarn run clean

build:
	yarn run tsc && cp -r src/config dist/src && cp -r src/data/ dist/src/data

docker-build:
	docker build -t $(IMAGE_NAME) .

docker-run:
	docker run \
		--network=host \
		--rm \
		--name $(IMAGE_NAME) \
		-e DEBUG=express:* \
		-e NODE_ENV=development \
		--env-file .env.development \
		-it \
		$(IMAGE_NAME) \

docker-clean:
	docker rmi $(IMAGE_NAME)

docker-shell:
	docker run \
		--rm \
		--name $(IMAGE_NAME)-shell \
		--no-healthcheck \
		-it $(IMAGE_NAME) /bin/sh

create-development:
	NODE_ENV=development npx sequelize-cli db:create

create-test:
	NODE_ENV=test npx sequelize-cli db:create

drop-development:
	NODE_ENV=development npx sequelize-cli db:drop

drop-test:
	NODE_ENV=test npx sequelize-cli db:drop

migrate-development:
	NODE_ENV=development npx sequelize-cli db:migrate

migrate-test:
	NODE_ENV=test npx sequelize-cli db:migrate

rollback-development:
	NODE_ENV=development npx sequelize-cli db:migrate:undo

rollback-test:
	NODE_ENV=test npx sequelize-cli db:migrate:undo

seed:
	NODE_ENV=development npx sequelize-cli db:seed:all

create: create-development create-test

drop: drop-development drop-test

migrate: migrate-development migrate-test

rollback: rollback-development rollback-test

redo: drop create migrate
