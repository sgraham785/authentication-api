.DEFAULT_GOAL := build

export IMAGE=authentication-api
ifdef GIT_COMMIT
  export IMAGE_NAME=${IMAGE}:${GIT_COMMIT}
else
  export IMAGE_NAME=${IMAGE}
endif
# $(shell echo IMAGE_NAME=${IMAGE_NAME} > .env)

help:
	@echo
	@echo
	@echo " make				- compile & build main image(s)"
	@echo
	@echo " make up			- creates the container(s)"
	@echo
	@echo " make build-dev			- compile, build image(s) & run container(s) in development mode"
	@echo
	@echo " make up-dev			- run container(s) in development mode"
	@echo
	@echo " make test			- creates container(s), run tests, then removes container(s)"
	@echo
	@echo " make clean			- clean all build artifacts, docker container(s), and target volumes"
	@echo
	@echo " make down			- removes the container(s)"
	@echo
	@echo

clean:
	- sudo docker-compose -f docker/dev.yml down
	- sudo rm -rf node_modules
npm-install:
	npm install
	npm run build
	# npm prune --production
build:	clean
	@echo "Compiling source..."
	sudo docker-compose -f docker/build.yml run --rm build make npm-install
	@echo "Building image..."
	sudo docker build -t $(IMAGE_NAME) .
build-deps:
	sudo docker build -f docker/postgres/Dockerfile -t $(IMAGE_NAME)-pgdb1 ./
	sudo docker build -f docker/redis/Dockerfile -t $(IMAGE_NAME)-redisdb1 ./
	sudo docker build -f docker/swagger-ui/Dockerfile -t $(IMAGE_NAME)-swagger-ui1 ./
build-dev:	build build-deps
	sudo docker-compose -f docker/dev.yml up -d app
up-dev:	down
	sudo docker-compose -f docker/dev.yml up -d
up:	down
	sudo docker-compose -f docker/up.yml up -d 
down:
	sudo docker-compose -f docker/dev.yml down --remove-orphans
test:	down
	sudo docker-compose -f docker/test.yml run --rm test-app
	sudo docker-compose -f docker/test.yml down --remove-orphans

.PHONY: test