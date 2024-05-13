import http from "@/utils/http";

export function getPermissions() {
  return http.get("/permissions");
}
