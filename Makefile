IMAGE_NAME := trade-tariff-commodi-tea
SHELL := /usr/bin/env bash

run: clean build
	source .env.development && yarn run start

test:
	yarn run test

clean:
	yarn run clean

build:
	yarn run build

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
