import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api/client";
import type { Device } from "../types";

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: () => apiGet<Device[]>("/devices"),
    staleTime: 10_000,
    refetchInterval: 10_000,
  });
}