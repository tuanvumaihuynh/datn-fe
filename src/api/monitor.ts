import http from "@/utils/http";

export function getMonitorCurrent() {
  return http.get("/monitor_current", {
    // @ts-ignore
    doNotShowLoading: true,
  });
}

export function getNodesInfo() {
  return http.get("/nodes", {
    // @ts-ignore
    doNotShowLoading: true,
  });
}

export function loadChartData(timeRange: number) {
  return http.get("/monitor", {
    params: {
      latest: timeRange,
    },
  });
}
