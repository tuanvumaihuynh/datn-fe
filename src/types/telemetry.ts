export interface Metric {
  ts: string;
  key: string;
  value: any;
}

export interface Log {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
}

export interface Attribute {
  key: string;
  value: any;
  lastUpdate: string;
}
