import http from "@/utils/http";

export function getDevices(params: {
  tags?: string[];
  page: number;
  pageSize: number;
}) {
  const q = {
    tags: params.tags?.join(","),
    page: params.page,
    page_size: params.pageSize,
  };
  return http.get("/devices", { params: q });
}

export function getDevice(id: string) {
  return http.get(`/devices/${id}`);
}

export function createDevice(data: {
  name: string;
  description?: string;
  isGateway: boolean;
  credentials: {
    username: string;
    password: string;
  };
  tags: string[];
}) {
  const body = {
    name: data.name,
    description: data.description,
    is_gateway: data.isGateway,
    credentials: data.credentials,
    tag_names: data.tags,
  };
  return http.post("/devices", body);
}

export function update_tags(id: string, tags: string[]) {
  return http.put(`/devices/${id}/tags`, { tag_names: tags });
}

export function getDeviceConnectivity(id: string) {
  return http.get(`/devices/${id}/connectivity`);
}

export function isDeviceConnected(id: string) {
  return http.get(`/devices/${id}/connected`);
}
