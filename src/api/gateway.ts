import http from "@/utils/http";

export function getGateways(params: { page: number; pageSize: number }) {
  const q = {
    page: params.page,
    page_size: params.pageSize,
  };
  return http.get("/gateways", { params: q });
}

export function getGateway(id: string) {
  return http.get(`/gateways/${id}`);
}

export function getGatewayDevices(params: {
  gatewayId: string;
  page: number;
  pageSize: number;
}) {
  const q = {
    page: params.page,
    page_size: params.pageSize,
  };
  return http.get(`/gateways/${params.gatewayId}/devices`, { params: q });
}
