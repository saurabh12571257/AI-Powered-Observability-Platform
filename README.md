# 🚀 AI-Powered Observability Platform

![Dashboard Preview](./assets/Dashboard.png)

A distributed, production-ready observability system that ingests, stores, analyzes, and visualizes application logs in real-time — enhanced with AI-driven insights.

---

## 🧠 Overview

This project is a full-stack observability platform designed to simulate real-world monitoring systems used in modern distributed architectures.

It enables:
- 📥 Log ingestion via REST APIs  
- 🔍 Fast search & filtering using Elasticsearch  
- 📊 Visualization with Kibana  
- 🤖 AI-powered log analysis using OpenAI  
- ☸️ Scalable deployment using Kubernetes  

---

## 🏗️ Architecture

Client → Backend (Node.js) → MongoDB (storage) → Elasticsearch (search + analytics) → OpenAI (AI insights) → Kibana (visualization)


---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Search Engine:** Elasticsearch  
- **Visualization:** Kibana  
- **AI Integration:** OpenAI API  
- **Containerization:** Docker  
- **Orchestration:** Kubernetes  

---

## 🔄 Data Flow

1. Client sends logs via API (`POST /api/logs`)
2. Backend:
   - Stores logs in MongoDB  
   - Indexes logs in Elasticsearch  
3. Elasticsearch enables:
   - Full-text search  
   - Filtering & pagination  
   - Aggregations  
4. OpenAI analyzes logs and generates insights  
5. Kibana visualizes logs in dashboards  

---

## 🚀 Features

- ✅ Real-time log ingestion  
- ✅ Full-text search with Elasticsearch  
- ✅ Filtering, pagination, and analytics APIs  
- ✅ AI-powered log summarization and anomaly detection  
- ✅ Kibana dashboards for visualization  
- ✅ Dockerized services  
- ✅ Kubernetes deployment with service-based communication  
- ✅ Secure secret management using Kubernetes Secrets  

---

# Kubernetes Deployment
- kubectl apply -f .