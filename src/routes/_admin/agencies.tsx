import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { AgenciesPage } from "./-agency/AgenciesPage";
import { validateAgenciesSearch } from "./-agency/route-search";

export const Route = createFileRoute("/_admin/agencies")({
  validateSearch: validateAgenciesSearch,
  component: AgenciesRoute,
});

function AgenciesRoute() {
  const routeSearch = Route.useSearch();
  const navigate = Route.useNavigate();
  const handleSearchChange = useCallback(
    (search?: string) => {
      void navigate({
        search: (previous) => ({
          ...previous,
          page: 1,
          search,
        }),
      });
    },
    [navigate],
  );
  const handleStatusChange = useCallback(
    (isActive?: boolean) => {
      void navigate({
        search: (previous) => ({
          ...previous,
          page: 1,
          isActive,
        }),
      });
    },
    [navigate],
  );
  const handlePageChange = useCallback(
    (page: number) => {
      void navigate({
        search: (previous) => ({
          ...previous,
          page,
        }),
      });
    },
    [navigate],
  );

  return (
    <AgenciesPage
      routeSearch={routeSearch}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
      onPageChange={handlePageChange}
    />
  );
}
