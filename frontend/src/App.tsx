import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DeviceList from "./features/devices/components/DeviceList";
import DeviceDetail from "./features/devices/components/DeviceDetail";

type Device = {
  id: string;
  name: string;
  status: "online" | "offline";
};

async function fetchDevices(): Promise<Device[]> {
  const res = await fetch("http://localhost:8000/devices");
  if (!res.ok) throw new Error("Failed to load devices");
  return res.json();
}

export default function App() {
  const { data: devices, isLoading, isError } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });

  const [selected, setSelected] = useState<string>("rb-001");

  useEffect(() => {
    if (!devices || devices.length === 0) return;
    if (devices.some((d) => d.id === selected)) return;
    setSelected(devices[0].id);
  }, [devices, selected]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Telemetry Console</h1>
          <p className="text-sm text-gray-500">Real-time monitoring dashboard</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="md:col-span-1">
          {isLoading && (
            <div className="bg-white rounded-lg border p-4 text-sm text-gray-500">
              Loading devices…
            </div>
          )}

          {isError && (
            <div className="bg-white rounded-lg border p-4 text-sm text-red-600">
              Failed to load devices. Is backend running?
            </div>
          )}

          {devices && (
            <DeviceList
              devices={devices}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </section>

        <section className="md:col-span-2">
          <DeviceDetail deviceId={selected} />
        </section>
      </main>
    </div>
  );
}