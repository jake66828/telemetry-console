// src/components/ConnectionStatus.tsx

type WsStatus = "connecting" | "open" | "closed" | "error";

export default function ConnectionStatus({ status }: { status: WsStatus }) {
  const label =
    status === "open"
      ? "Connected"
      : status === "connecting"
      ? "Connecting…"
      : status === "error"
      ? "Error"
      : "Closed";

  const dotClass =
    status === "open"
      ? "bg-green-500"
      : status === "connecting"
      ? "bg-yellow-500"
      : status === "error"
      ? "bg-red-500"
      : "bg-gray-400";

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
      <span className="text-gray-500">WebSocket:</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}