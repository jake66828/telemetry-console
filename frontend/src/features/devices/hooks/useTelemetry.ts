import { useEffect, useMemo, useState } from "react";

export type Telemetry = {
  deviceId: string;
  ts: number;
  battery: number;
  tempC: number;
  speed: number;
  event?: string;
};

export function useTelemetry(deviceId: string) {
  const [latest, setLatest] = useState<Telemetry | null>(null);
  const [events, setEvents] = useState<Telemetry[]>([]);
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "open" | "closed" | "error"
  >("connecting");

  const wsUrl = useMemo(() => {
    return `ws://localhost:8000/ws/telemetry/${deviceId}`;
  }, [deviceId]);

  useEffect(() => {
    setLatest(null);
    setEvents([]);
    setHistory([]);
    setStatus("connecting");

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setStatus("open");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data) as Telemetry;

      setLatest(data);

      setHistory((prev) => {
        const next = [...prev, data];
        return next.slice(-60); // keep last 60 points (~30 sec)
      });

      if (data.event && data.event.trim().length > 0) {
        setEvents((prev) => [data, ...prev].slice(0, 20));
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("closed");

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  return { latest, events, history, status };
}