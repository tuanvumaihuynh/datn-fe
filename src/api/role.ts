import http from "@/utils/http";

export function getPermissions() {
  return http.get("/permissions");
}

export function getRoles() {
  return http.get("/roles");
}
