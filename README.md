# BacOps

This project contains the BacOps application with:

- a Laravel API in [Back_End/bacops-api](Back_End/bacops-api)
- a Next.js web app in [Back_End/bacops-web](Back_End/bacops-web)
- a Docker setup in [Back_End/docker-compose.yml](Back_End/docker-compose.yml)

## Requirements

Before starting the project, make sure you have:

- Git
- Docker
- Docker Compose
- A browser to open the app

Optional for local PHP development:

- PHP 8.3+
- Composer
- Node.js 20+
- npm

## Clone the project

```bash
git clone <your-repository-url>
cd BacOps_Backend
```

## Start the project

The easiest way is to use Docker from the project folder:

```bash
cd Back_End
docker compose up -d --build
```

Alternatively, use the included Makefile from the project root:

```bash
make up
```

This will start:

- Laravel API on http://localhost:8000
- Next.js frontend on http://localhost:3000
- MySQL database on port 3306

## Useful commands

### Start the stack

```bash
make up
```

### Stop the stack

```bash
make down
```

### Restart the stack

```bash
make restart
```

### View all logs

```bash
make logs
```

### View API logs

```bash
make api
```

### View frontend logs

```bash
make web
```

### Show running containers

```bash
make status
```

### Remove containers and volumes

```bash
make clean
```

## Environment files

The Docker stack uses the root environment file in [Back_End/.env](Back_End/.env) and the Laravel app uses [Back_End/bacops-api/.env](Back_End/bacops-api/.env).

If needed, update the database credentials and app URLs there before starting the project.

## Project structure

```text
BacOps_Backend/
├── Back_End/
│   ├── .env
│   ├── docker-compose.yml
│   ├── bacops-api/
│   └── bacops-web/
└── README.md
```

## Notes

- If Docker reports a container name conflict, remove the old containers and start again.
- If the backend is not reachable, check that the containers are running and that the app environment variables are valid.

## Support

If there is an issue with the setup, start by checking the Docker logs:

```bash
cd Back_End
docker compose logs api
```
