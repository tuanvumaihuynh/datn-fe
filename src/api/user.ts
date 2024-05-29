import http from "@/utils/http";

export function getCurrentUser() {
  return http.get("/users/me");
}

export function getUsers(params: {
  enabled?: boolean;
  page: number;
  pageSize: number;
}) {
  const q = {
    enabled: params.enabled,
    page: params.page,
    page_size: params.pageSize,
  };
  return http.get("/users", { params: q });
}
