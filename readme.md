# Installation

## Requirements

- Docker
- Docker Compose

## PREREQUISITES

- Install Docker
- Install Docker Compose
- Clone the repository
- add .env file

## Installation

Clone the repository

```bash
git clone https://github.com/Jesuph-teaching/session-backend.git
```

Navigate to the project directory

```bash
cd ./session-backend
```

Create a .env file in the root of the project directory

```bash
touch .env
```

Add the following environment variables to the .env file

```bash
SECRET_KEY= <your-secret-key>
```

Build the docker container

```bash
docker-compose up --build
```

Navigate to the following URL in your browser

```bash
http://localhost:3000
```
