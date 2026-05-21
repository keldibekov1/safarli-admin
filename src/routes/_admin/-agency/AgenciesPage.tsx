import { useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useDebounce } from "@/hooks/use-debounce";
import { useAgenciesQuery } from "@/services/agencies";
import { AgenciesFilters } from "./components/AgenciesFilters";
import { AgenciesPagination } from "./components/AgenciesPagination";
import { AgenciesPageHeader } from "./components/AgenciesPageHeader";
import { AgenciesTable } from "./components/AgenciesTable";
import { useAgencyColumns } from "./components/useAgencyColumns";
import {
  getAgencyStatusFilter,
  getAgencyStatusValue,
  type AgenciesRouteSearch,
  type AgencyStatusFilter,
} from "./route-search";

type AgenciesPageProps = {
  routeSearch: AgenciesRouteSearch;
  onSearchChange: (search?: string) => void;
  onStatusChange: (isActive?: boolean) => void;
  onPageChange: (page: number) => void;
};

export function AgenciesPage({
  routeSearch,
  onSearchChange,
  onStatusChange,
  onPageChange,
}: AgenciesPageProps) {
  const routeSearchValue = routeSearch.search ?? "";
  const [search, setSearch] = useState(routeSearchValue);
  const [sorting, setSorting] = useState<SortingState>([]);
  const debouncedSearch = useDebounce(search);
  const statusFilter = getAgencyStatusFilter(routeSearch.isActive);
  const columns = useAgencyColumns();

  const agenciesQuery = useAgenciesQuery({
    page: routeSearch.page,
    limit: routeSearch.limit,
    isActive: routeSearch.isActive,
    search: routeSearch.search,
  });

  const agencies = agenciesQuery.data?.data ?? [];
  const total = agenciesQuery.data?.total ?? 0;
  const currentPage = agenciesQuery.data?.currentPage ?? routeSearch.page;
  const totalPages = agenciesQuery.data?.totalPages ?? 1;

  useEffect(() => {
    setSearch(routeSearchValue);
  }, [routeSearchValue]);

  useEffect(() => {
    const nextSearch = debouncedSearch.trim();
    if (nextSearch === routeSearchValue) return;

    onSearchChange(nextSearch || undefined);
  }, [debouncedSearch, onSearchChange, routeSearchValue]);

  const table = useReactTable({
    data: agencies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleStatusChange = (status: AgencyStatusFilter) => {
    onStatusChange(getAgencyStatusValue(status));
  };

  return (
    <div className="space-y-6">
      <AgenciesPageHeader />

      <AgenciesFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={handleStatusChange}
      />

      <AgenciesTable
        columnsCount={columns.length}
        isError={agenciesQuery.isError}
        isLoading={agenciesQuery.isLoading}
        table={table}
      />

      <AgenciesPagination
        currentPage={currentPage}
        isFetching={agenciesQuery.isFetching}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
