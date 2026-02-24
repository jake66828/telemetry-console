type Device = {
  id: string;
  name: string;
  status: "online" | "offline";
};

type Props = {
  devices: Device[];
  selected: string;
  onSelect: (id: string) => void;
};

export default function DeviceList({ devices, selected, onSelect }: Props) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="font-medium mb-3">Devices</h2>

      <div className="space-y-2">
        {devices.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={`w-full text-left rounded-md border px-3 py-2 hover:bg-gray-50 ${
              selected === d.id ? "border-black" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-gray-500">{d.id}</div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  d.status === "online"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {d.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}