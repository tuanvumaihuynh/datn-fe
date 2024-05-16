import { useRouteQuery } from "@vueuse/router";

export function usePaginationRouteQuery() {
  const page = useRouteQuery("page", "1", { transform: Number });
  const pageSize = useRouteQuery("pageSize", "10", { transform: Number });
  return { page, pageSize };
}
