DOCKER_COMPOSE := docker compose
COMPOSE_DIR := Back_End

.PHONY: up down restart logs api web mysql api-up web-up mysql-up api-down web-down mysql-down api-rebuild web-rebuild mysql-rebuild status clean

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

mysql:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) logs -f mysql

api-up:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d api

web-up:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d web

mysql-up:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d mysql

api-down:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) stop api

web-down:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) stop web

mysql-down:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) stop mysql

api-rebuild:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d --build api

web-rebuild:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d --build web

mysql-rebuild:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) up -d --build mysql

clean:
	cd $(COMPOSE_DIR) && $(DOCKER_COMPOSE) down -v --remove-orphans
