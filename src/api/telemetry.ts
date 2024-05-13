import http from "@/utils/http";

export function getDeviceAttributeKeys(deviceId: string) {
  return http.get("/telemetry/attributes/keys", {
    params: { device_id: deviceId },
  });
}

export function getDeviceAttributes(params: {
  deviceId: string;
  keys: string[];
}) {
  const q = {
    device_id: params.deviceId,
    keys: params.keys.join(","),
  };
  return http.get("/telemetry/attributes/values", { params: q });
}

export function getDeviceMetricKeys(deviceId: string) {
  return http.get("/telemetry/metrics/keys", {
    params: { device_id: deviceId },
  });
}

export function getLatestDeviceMetrics(deviceId: string) {
  return http.get("/telemetry/metrics/values/latest", {
    params: { device_id: deviceId },
  });
}

interface DeviceMetricAggParams {
  deviceId: string;
  key: string;
  start: Date;
  end: Date;
  intervalType: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH";
  intervalCount: number;
  aggType: "AVG" | "MIN" | "MAX" | "SUM" | "COUNT";
  limit?: number;
}

type DeviceMetricParams = Omit<
  DeviceMetricAggParams,
  "aggType" | "intervalType" | "intervalCount"
>;

export function getDeviceMetrics(
  params: DeviceMetricParams | DeviceMetricAggParams
) {
  const q = {
    device_id: params.deviceId,
    key: (params as DeviceMetricParams).key,
    start: (params as DeviceMetricAggParams).start?.toISOString(),
    end: (params as DeviceMetricAggParams).end?.toISOString(),
    interval_type: (params as DeviceMetricAggParams).intervalType,
    interval_count: (params as DeviceMetricAggParams).intervalCount,
    agg_type: (params as DeviceMetricAggParams).aggType,
    limit: (params as DeviceMetricAggParams).limit,
  };
  return http.get("/telemetry/metrics/values", { params: q });
}
