# Telemetry Console

A real-time telemetry monitoring dashboard built with React + TypeScript (frontend) and FastAPI (backend).  
The system streams live device telemetry via WebSocket and renders rolling time-series charts with health scoring.

---

## Overview

This project demonstrates a full-stack real-time architecture:

FastAPI → WebSocket → Custom React Hook → Live UI (Recharts)

Devices continuously stream telemetry data including battery level, temperature, speed, and event logs.

---

## Features

- Real-time telemetry streaming (WebSocket)
- Device list with live status
- Rolling 30-second time-series visualization
- KPI cards (Battery / Temperature / Speed)
- Event feed panel
- Explainable health score (derived from multiple signals)
- Automatic WebSocket reconnection handling
- Clean frontend/backend separation

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Recharts

### Backend
- FastAPI
- Uvicorn
- WebSocket endpoint

---

## Architecture

The frontend subscribes to backend telemetry streams using a custom React hook:

```
FastAPI → WebSocket → useTelemetry() → React State → Recharts
```

Connection state is managed with:
- Lifecycle isolation to prevent stale connections
- Automatic reconnection handling
- Rolling time window trimming (performance-safe updates)

---

## Running Locally

### 1. Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

API docs available at:
http://127.0.0.1:8000/docs

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:
http://localhost:5173

---

## Example WebSocket Payload

```json
{
  "deviceId": "rb-001",
  "ts": 1771898827.49,
  "battery": 79,
  "tempC": 36.3,
  "speed": 0.39,
  "event": "Motor spike"
}
```

---

## What This Project Demonstrates

- Real-time client/server communication
- WebSocket lifecycle management
- Streaming state handling with React hooks
- Performance-safe rolling chart rendering
- Clean modular frontend architecture
- Practical full-stack system design