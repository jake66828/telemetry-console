// src/features/devices/components/DeviceDetail.tsx

import ConnectionStatus from "../../../components/ConnectionStatus";
import { useTelemetry } from "../../../hooks/useTelemetry";
import { computeHealthScore, healthBadgeClass } from "../../../utils/health";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DeviceDetail({ deviceId }: { deviceId: string }) {
  const { latest, events, history, status } = useTelemetry(deviceId);

  const health = latest ? computeHealthScore(latest) : null;

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Device: {deviceId}</h2>
          <div className="mt-1">
            <ConnectionStatus status={status} />
          </div>
        </div>

        {health && (
          <div className="flex flex-col items-end gap-2">
            <div
              className={`text-sm px-3 py-1 rounded-full border ${healthBadgeClass(
                health.level
              )}`}
              title="Health score is derived from battery, temperature, and speed"
            >
              Health: <span className="font-semibold">{health.score}</span> •{" "}
              {health.level}
            </div>

            <div className="text-xs text-gray-400">
              explainable score (battery/temp/speed)
            </div>
          </div>
        )}
      </div>

      {/* ================= KPI CARDS ================= */}
      {!latest ? (
        <div className="text-sm text-gray-500 mb-4">Waiting for telemetry…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">Battery</div>
            <div className="text-2xl font-semibold">{latest.battery}%</div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">Temp</div>
            <div className="text-2xl font-semibold">{latest.tempC}°C</div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">Speed</div>
            <div className="text-2xl font-semibold">{latest.speed} m/s</div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">Health</div>
            <div className="text-2xl font-semibold">
              {health ? health.score : "--"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {health ? health.level : ""}
            </div>
          </div>
        </div>
      )}

      {/* ================= CHART ================= */}
      <div className="rounded-lg border p-3 mb-4">
        <div className="text-sm font-medium mb-2">Telemetry (last ~30s)</div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis
                dataKey="ts"
                tickFormatter={(v) =>
                  new Date(Number(v) * 1000).toLocaleTimeString().slice(0, 8)
                }
              />

              {/* Battery + Speed on left axis */}
              <YAxis yAxisId="left" domain={[0, 100]} />

              {/* Temp on right axis */}
              <YAxis yAxisId="right" orientation="right" />

              <Tooltip
                labelFormatter={(label) =>
                  new Date(Number(label) * 1000).toLocaleTimeString()
                }
              />

              {/* ✅ Explicit colors so they don’t all become blue */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="battery"
                dot={false}
                strokeWidth={2}
                stroke="#2563eb"
                name="battery"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tempC"
                dot={false}
                strokeWidth={2}
                stroke="#ef4444"
                name="tempC"
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="speed"
                dot={false}
                strokeWidth={2}
                stroke="#16a34a"
                name="speed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= RECENT EVENTS ================= */}
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium mb-2">Recent events</div>

        {events.length === 0 ? (
          <div className="text-sm text-gray-500">No events yet.</div>
        ) : (
          <ul className="space-y-2">
            {events.slice(0, 10).map((e, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="text-gray-500">
                  {new Date(e.ts * 1000).toLocaleTimeString()}{" "}
                </span>
                — <span className="font-medium">{e.event}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}