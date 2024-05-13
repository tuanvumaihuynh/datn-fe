import http from "@/utils/http";

export function getTags(params: { page: number; pageSize: number }) {
  const q = {
    page: params.page,
    page_size: params.pageSize,
  };
  return http.get("/tags", { params: q });
}

export function createTag(name: string) {
  return http.post("/tags", { name });
}

export function deleteTag(id: string) {
  return http.delete(`/tags/${id}`);
}
