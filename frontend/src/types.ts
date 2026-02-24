export type DeviceStatus = "online" | "offline";

export type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
};

export type TelemetryMessage = {
  deviceId: string;
  ts: number;        // unix timestamp
  battery: number;   // 0-100
  tempC: number;
  speed: number;     // m/s
  event?: string;
};
