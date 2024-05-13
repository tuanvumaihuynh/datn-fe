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
