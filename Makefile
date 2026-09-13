DOCKER_COMPOSE := docker compose
COMPOSE_DIR := Back_End

.PHONY: up down restart logs api logs-api web logs-web status clean

up:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d --build

down:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) down

restart:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) restart

status:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) ps

logs:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) logs -f

api:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) logs -f api

web:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) logs -f web

clean:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) down -v --remove-orphans
