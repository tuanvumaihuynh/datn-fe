import http from "@/utils/http";

export function getApiKeys() {
  return http.get("/api_keys");
}

export function createApiKey(apiKey: {
  name: string;
  enabled: boolean;
  scopes: string[];
}) {
  return http.post("/api_keys", apiKey);
}

export function updateApiKey(apiKey: {
  id: string;
  name: string;
  enabled: boolean;
  scopes: string[];
}) {
  const { id, ...data } = apiKey;
  return http.patch(`/api_keys/${id}`, data);
}

export function deleteApiKey(id: string) {
  return http.delete(`/api_keys/${id}`);
}
