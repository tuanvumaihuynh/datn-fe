import http from "@/utils/http";

export function getMonitorCurrent() {
  return http.get("/monitor_current");
}

export function getNodesInfo() {
  return http.get("/nodes");
}

export function loadChartData(timeRange: number) {
  return http.get("/monitor", {
    params: {
      latest: timeRange,
    },
  });
}
