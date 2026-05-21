import { useQuery } from "@tanstack/react-query";
import { getAgencies, type GetAgenciesParams } from "@/api/agencies";

type AgenciesQueryParams = Required<Pick<GetAgenciesParams, "page" | "limit" | "search">> &
  Pick<GetAgenciesParams, "isActive">;

export const agenciesQueryKeys = {
  all: ["agencies"] as const,
  list: ({ page, limit, isActive, search }: AgenciesQueryParams) =>
    [...agenciesQueryKeys.all, "list", { page, limit, isActive, search }] as const,
};

export function useAgenciesQuery({
  page = 1,
  limit = 10,
  isActive,
  search = "",
}: GetAgenciesParams = {}) {
  return useQuery({
    queryKey: agenciesQueryKeys.list({ page, limit, isActive, search }),
    queryFn: () => getAgencies({ page, limit, isActive, search: search || undefined }),
  });
}
