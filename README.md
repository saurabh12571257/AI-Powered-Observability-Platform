# AI-Powered Observability Platform

A full-stack observability project for ingesting, storing, searching, and analyzing application logs with AI-assisted incident investigation.

This repository combines a React dashboard, a Node.js/Express backend, MongoDB for log persistence, Elasticsearch for search and aggregations, OpenAI for incident summaries, and Docker/Kubernetes deployment assets.

## Architecture

`Client -> Express API -> MongoDB + Elasticsearch -> OpenAI -> React Dashboard / Kibana`

### Core flow

1. Applications send logs to `POST /api/logs`.
2. The backend stores each log in MongoDB.
3. The same log is indexed into Elasticsearch for search and analytics.
4. Socket.IO emits the new log to connected dashboard clients.
5. The frontend renders live logs, filters, and alert-driven AI analysis.
6. Kibana can be exposed alongside the app for log exploration.

## Tech Stack

- Frontend: React, Axios, Socket.IO Client, Tailwind CSS
- Backend: Node.js, Express, Socket.IO, Mongoose
- Data: MongoDB, Elasticsearch
- AI: OpenAI API
- Deployment: Docker, NGINX, Kubernetes, Ingress
- Visualization: Kibana

## Key Features

- Centralized log ingestion through REST endpoints
- Dual-write pipeline to MongoDB and Elasticsearch
- Full-text search across `message`, `service`, and `level`
- Filterable log views by severity and service metadata
- Pagination support for backend log queries
- Real-time log streaming with Socket.IO
- Dashboard metrics for total logs, warnings, error rate, and service count
- AI-assisted incident analysis for recent or user-provided log bursts
- Automatic frontend alerting for 5 consecutive error logs within a 4-second window
- Docker Compose setup for backend, Elasticsearch, and Kibana
- Kubernetes manifests for frontend, backend, Elasticsearch, Kibana, services, and ingress routing

## Repository Structure

```text
backend/
  src/
    config/
    controllers/
    models/
    routes/
    services/
frontend/
  src/
    components/
k8s/
docker-compose.yaml
```

## Backend API

### `POST /api/logs`

Ingests a log entry and broadcasts it to connected clients.

Example payload:

```json
{
  "service": "auth-service",
  "level": "error",
  "message": "Token validation failed for request 42"
}
```

### `GET /api/logs`

Returns paginated logs from Elasticsearch.

Supported query parameters:

- `page`
- `limit`
- `level`
- `service`
- `search`

### `GET /api/logs/stats`

Returns aggregated counts by log level from Elasticsearch.

### `GET /api/logs/ai-analysis`
### `POST /api/logs/ai-analysis`

Generates AI-based analysis. If no logs are supplied, the service analyzes the 10 most recent indexed logs.

Example request body:

```json
{
  "logs": [
    {
      "service": "payment-service",
      "level": "error",
      "message": "Stripe timeout"
    }
  ]
}
```

## Frontend Dashboard

The React dashboard includes:

- Live log stream fed by Socket.IO
- Search bar for client-side filtering
- Severity filters for `all`, `error`, `warn`, and `info`
- Stats cards for operational visibility
- Incident side panel for AI-generated summaries
- Alert state when 5 error logs occur within 4 seconds

## Environment Variables

The backend expects:

```env
PORT=8000
MONGO_URI=<your_mongodb_connection_string>
OPENAI_API_KEY=<your_openai_api_key>
```

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Docker Compose

The repository includes a Compose file for:

- `backend`
- `elasticsearch`
- `kibana`

Run:

```bash
docker compose up --build
```

Note: the current Compose setup does not provision MongoDB, so `MONGO_URI` must point to an available MongoDB instance.

## Kubernetes Deployment

The `k8s/` directory contains manifests for:

- Backend deployment and service
- Frontend deployment and service
- Elasticsearch deployment and service
- Kibana deployment and service
- Ingress routing for `/`, `/api/`, `/socket.io/`, and `/kibana/`

Apply manifests with:

```bash
kubectl apply -f k8s/
```

The backend deployment reads `OPENAI_API_KEY` and `MONGO_URI` from Kubernetes secrets named `backend-secrets`.

## Notable Implementation Details

- Backend image uses `node:22-alpine`
- Frontend is served with `nginx:alpine`
- NGINX proxies `/api/` and `/socket.io/` traffic to `backend-service`
- Elasticsearch runs in single-node mode in the provided manifests
- Kibana is configured to connect to the in-cluster Elasticsearch service

## Resume-Friendly Project Summary

Built a cloud-native log observability platform that ingests application events, indexes them into Elasticsearch, streams them live to a React dashboard, and uses OpenAI to summarize high-severity incidents for faster debugging.
