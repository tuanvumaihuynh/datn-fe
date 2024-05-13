export interface DeviceCredentials {
  clientId: string;
  username: string;
  password: string;
}

export interface Device {
  id: string;
  name: string;
  description: string;
  isGateway: boolean;
  tags: string[];
  createdAt: string;
}
