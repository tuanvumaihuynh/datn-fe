import { DeviceCredentials } from "./device";

export interface Gateway {
  id: string;
  name: string;
  description: string;
  tags: string[];
  credentials: DeviceCredentials;
  createdAt: string;
  ipAddress: string;
  port: number;
  connected: boolean;
  node: string;
  connectedAt?: string;
  disconnectedAt?: string;
}
