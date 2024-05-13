import http from "@/utils/http";

export function login(user: { username: string; password: string }) {
  return http.post("/auth/login", user);
}

export function logout() {
  return http.post("/auth/logout");
}
