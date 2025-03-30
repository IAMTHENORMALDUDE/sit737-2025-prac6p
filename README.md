# SIT737-2025-Prac5P: Dockerized Calculator Microservice

## Overview

This project containerizes my Prac 4.1P calculator microservice using Docker and Docker Compose, with a health check for reliability.

## Setup Instructions

1. **Prerequisites**:
   - Docker, Node.js, Git installed.
2. **Clone the Repo**:
   ```bash
   git clone https://github.com/IAMTHENORMALDUDE/sit737-2025-prac5p.git
   cd sit737-2025-prac5p
   ```
3. **Build and Run**:
   ```bash
   docker-compose up -d
   ```
4. **Test**:
   - `http://localhost:3000/add?num1=5&num2=3`
   - Check logs in `./logs/`.
5. **Stop**:
   ```bash
   docker-compose down
   ```

## Files

- `Dockerfile`: Defines the Node.js image.
- `docker-compose.yml`: Configures the service with health check.
- `index.js`: Calculator app code.

## Health Check

- Monitors `/health` endpoint every 30s.
- Restarts container after 3 failures.
