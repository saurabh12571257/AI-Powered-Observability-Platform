# Lumina: AI-Powered Observability Platform

Lumina is a premium, futuristic observability platform designed for real-time log ingestion, neural-pulse monitoring, and AI-driven incident resolution. It features a "Neon Glass" aesthetic and integrates advanced AI agents to help engineers troubleshoot system health instantly.

This repository combines a high-performance React dashboard, a Node.js/Express backend, MongoDB for log persistence, Elasticsearch 9 for lightning-fast search, and OpenAI GPT-4o for intelligent incident correlation and chat-based debugging.

## 🚀 Key Features

- **Neural Pulse UI**: A high-contrast, "Neon Glass" aesthetic with dynamic micro-animations and a responsive sidebar.
- **AI Chat Assistant (Lumina)**: An intelligent chatbot specifically guardrailed for log analysis and system troubleshooting.
- **Incident Intelligence**: Automatic detection of error bursts with one-click AI investigation windows.
- **Real-Time Streaming**: Live log feed via Socket.IO with sub-millisecond latency.
- **Dual-Data Persistence**: Elastic-first search with MongoDB fallback for maximum reliability.
- **Kubernetes Native**: Ready-to-use K8s manifests and professional-grade Helm charts.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS 3.4, Axios, Socket.IO Client
- **Backend**: Node.js 22, Express 5.2, Socket.IO 4.8, Mongoose 9.4
- **Search & AI**: Elasticsearch 9.3, OpenAI GPT-4o (v6 SDK)
- **Infrastructure**: Docker, NGINX, Kubernetes, Helm 3
- **Visualization**: Kibana 8.12

---

## 📂 Repository Structure

```text
backend/                # Node.js Express server with log ingestion and AI logic
  src/
    config/             # DB and AI client configurations
    controllers/        # Route handlers for logs, stats, and AI chat
    services/           # Business logic for ES indexing and OpenAI integration
frontend/               # React application with Neon Glass UI
  src/
    components/         # Modular UI (AIChat, Dashboard, Sidebar, etc.)
charts/                 # Lumina Helm charts for enterprise deployment
k8s/                    # Standalone Kubernetes manifests
docker-compose.yaml      # Local orchestration for dev environments
```

---

## 🔌 Backend API

### `POST /api/logs`
Ingests a log entry. Example payload:
```json
{
  "service": "auth-service",
  "level": "error",
  "message": "Token validation failed"
}
```

### `GET /api/logs`
Paginated search from Elasticsearch. Supports `page`, `limit`, `level`, `service`, and `search` query params.

### `POST /api/logs/chat`
Interact with Lumina, the AI assistant.
```json
{
  "messages": [{ "role": "user", "content": "Why is the auth-service failing?" }]
}
```

---

## 📦 Deployment

### 1. Local (Docker Compose)
The Compose file provisions the backend, Elasticsearch, and Kibana.
```bash
docker compose up --build
```
*Note: Ensure `MONGO_URI` and `OPENAI_API_KEY` are set in your environment.*

### 2. Kubernetes (Manual)
```bash
kubectl apply -f k8s/
```

### 3. Helm (Recommended)
Deploy the full stack using the industry-standard Helm chart.
```bash
cd charts/lumina
helm install lumina . --values values.yaml
```

---

## ⚙️ Environment Variables

The backend requires the following configuration:
- `PORT`: Server port (default: 8000)
- `MONGO_URI`: MongoDB connection string
- `OPENAI_API_KEY`: Your OpenAI API key

---

## 🎨 Design Philosophy
Lumina uses a **Neon Glass** design system, prioritizing:
- **Depth**: Translucent layers and frosted glass effects.
- **Interactivity**: Fluid transitions and haptic-like hover responses.
- **Clarity**: High-contrast typography and semantic color coding for log levels.

---
*Built for the future of observability.*