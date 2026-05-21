export type AgenciesRouteSearch = {
  page: number;
  limit: number;
  isActive?: boolean;
  search?: string;
};

export type AgencyStatusFilter = "all" | "active" | "inactive";

export const agenciesLimit = 10;

export function validateAgenciesSearch(search: Record<string, unknown>): AgenciesRouteSearch {
  const page = Number(search.page);
  const limit = Number(search.limit);
  const rawIsActive = search.isActive;
  const isActive =
    rawIsActive === true || rawIsActive === "true"
      ? true
      : rawIsActive === false || rawIsActive === "false"
        ? false
        : undefined;

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : agenciesLimit,
    isActive,
    search: typeof search.search === "string" && search.search.trim() ? search.search : undefined,
  };
}

export function getAgencyStatusFilter(isActive?: boolean): AgencyStatusFilter {
  if (isActive === true) return "active";
  if (isActive === false) return "inactive";

  return "all";
}

export function getAgencyStatusValue(status: AgencyStatusFilter) {
  if (status === "active") return true;
  if (status === "inactive") return false;

  return undefined;
}
