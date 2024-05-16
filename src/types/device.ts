export interface DeviceCredentials {
  clientId: string;
  username: string;
  password: string;
}

export type DeviceType = "Gateway" | "Device" | "SubDevice";

export interface Device {
  id: string;
  name: string;
  description: string;
  type: DeviceType;
  credentials?: DeviceCredentials;
  connected: boolean;
  tags: string[];
  createdAt: string;
}

export interface DeviceConnectivity {
  connected: boolean;
  node: string;
  client_id: string;
  username: string;
  ip_address: string;
  port: number;
  conn_connected_at: string;
  conn_disconnected_at: string;
  conn_created_at: string;
  pub_msg_send: number;
  pub_msg_send_qos0: number;
  pub_msg_send_qos1: number;
  pub_msg_send_qos2: number;
  recv_msg_send: number;
  recv_msg_send_qos0: number;
  recv_msg_send_qos1: number;
  recv_msg_send_qos2: number;
  bytes_sent: number;
  bytes_received: number;
  subscriptions_cnt: number;
  subscriptions_max: number | string;
}
