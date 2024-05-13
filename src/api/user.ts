import http from "@/utils/http";

export function getCurrentUser() {
  return http.get("/users/me");
}
