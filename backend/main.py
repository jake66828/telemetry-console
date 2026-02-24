import asyncio
import json
import random
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICES = [
    {"id": "rb-001", "name": "Rover 001", "status": "online"},
    {"id": "rb-002", "name": "Rover 002", "status": "online"},
    {"id": "rb-003", "name": "Rover 003", "status": "offline"},
]

@app.get("/devices")
def list_devices():
    return DEVICES

@app.websocket("/ws/telemetry/{device_id}")
async def telemetry_ws(ws: WebSocket, device_id: str):
    await ws.accept()

    battery = random.randint(60, 95)
    temp = random.uniform(28.0, 38.0)

    try:
        while True:
            battery = max(0, battery - random.choice([0, 0, 1]))
            temp += random.uniform(-0.2, 0.2)

            payload = {
                "deviceId": device_id,
                "ts": time.time(),
                "battery": battery,
                "tempC": round(temp, 1),
                "speed": round(random.uniform(0.0, 1.8), 2),
                "event": random.choice(
                    ["", "", "", "Waypoint reached", "Obstacle detected", "Motor spike"]
                ),
            }

            await ws.send_text(json.dumps(payload))
            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        return