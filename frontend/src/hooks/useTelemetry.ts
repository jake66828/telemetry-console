// src/hooks/useTelemetry.ts
import { useEffect, useMemo, useRef, useState } from "react";

export type TelemetryMessage = {
  deviceId: string;
  ts: number;
  battery: number;
  tempC: number;
  speed: number;
  event?: string;
};

export type WsStatus = "connecting" | "open" | "closed" | "error";

const WINDOW_SECONDS = 30;
const MAX_POINTS = 300;
const RECONNECT_MS = 800;

export function useTelemetry(deviceId: string) {
  const [status, setStatus] = useState<WsStatus>("connecting");
  const [latest, setLatest] = useState<TelemetryMessage | null>(null);
  const [history, setHistory] = useState<TelemetryMessage[]>([]);
  const [events, setEvents] = useState<TelemetryMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const connIdRef = useRef(0);

  useEffect(() => {
    connIdRef.current += 1;
    const myConnId = connIdRef.current;

    setStatus("connecting");
    setLatest(null);
    setHistory([]);
    setEvents([]);

    const isLatest = () => connIdRef.current === myConnId;

    let retryTimer: number | null = null;

    const connect = () => {
      if (!isLatest()) return;

      setStatus("connecting");

      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/telemetry/${deviceId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isLatest()) return;
        console.log("ws open", deviceId);
        setStatus("open");
      };

      ws.onclose = (e) => {
        if (!isLatest()) return;
        console.log("ws close", deviceId, e.code, e.reason);
        setStatus("closed");

        // ✅ auto-reconnect
        retryTimer = window.setTimeout(() => {
          connect();
        }, RECONNECT_MS);
      };

      ws.onerror = (e) => {
        if (!isLatest()) return;
        console.log("ws error", deviceId, e);
        setStatus("error");
        // onclose will usually follow and trigger reconnect
      };

      ws.onmessage = (evt) => {
        if (!isLatest()) return;

        try {
          const msg = JSON.parse(evt.data) as TelemetryMessage;

          setLatest(msg);

          setHistory((prev) => {
            const next = [...prev, msg];
            const cutoff = Date.now() / 1000 - WINDOW_SECONDS;
            return next.filter((x) => x.ts >= cutoff).slice(-MAX_POINTS);
          });

          if (msg.event && msg.event.trim().length > 0) {
            setEvents((prev) => [msg, ...prev].slice(0, 10));
          }
        } catch {
          // ignore malformed message
        }
      };
    };

    connect();

    return () => {
      connIdRef.current += 1; // invalidate this connection
      if (retryTimer) window.clearTimeout(retryTimer);

      try {
        wsRef.current?.close();
      } catch {}

      wsRef.current = null;
    };
  }, [deviceId]);

  return useMemo(
    () => ({ status, latest, events, history }),
    [status, latest, events, history]
  );
}