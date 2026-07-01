import { useCallback, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useAgenciesQuery,
  useCreateAgencyMutation,
  useDeleteAgencyMutation,
  useExportAgenciesMutation,
  useRegionsQuery,
  useUpdateAgencyMutation,
  useUpdateAgencyStatusMutation,
} from "@/services/agencies";
import { type Agency, type CreateAgencyDto } from "@/api/agencies";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AgenciesFilters } from "./components/AgenciesFilters";
import { AgenciesPagination } from "./components/AgenciesPagination";
import { AgenciesPageHeader } from "./components/AgenciesPageHeader";
import { AgenciesTable } from "./components/AgenciesTable";
import { useAgencyColumns } from "./components/useAgencyColumns";
import AgencyFormDialog from "./components/AgencyFormDialog";
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [agencyToDelete, setAgencyToDelete] = useState<Agency | null>(null);

  const openCreate = useCallback(() => {
    setEditingAgency(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((agency: Agency) => {
    setEditingAgency(agency);
    setDialogOpen(true);
  }, []);

  const statusMutation = useUpdateAgencyStatusMutation({
    onSuccess: (agency) => {
      toast.success(
        agency.isActive ? "Agentlik faollashtirildi" : "Agentlik to'xtatildi",
      );
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const toggleStatus = useCallback(
    (agency: Agency) => {
      statusMutation.mutate({ id: agency.id, isActive: !agency.isActive });
    },
    [statusMutation],
  );

  const columns = useAgencyColumns({
    onEdit: openEdit,
    onToggleStatus: toggleStatus,
    onDelete: setAgencyToDelete,
  });

  const regionsQuery = useRegionsQuery();

  const createMutation = useCreateAgencyMutation({
    onSuccess: () => {
      toast.success("Agentlik qo'shildi");
      setDialogOpen(false);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const updateMutation = useUpdateAgencyMutation({
    onSuccess: () => {
      toast.success("Agentlik yangilandi");
      setDialogOpen(false);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const deleteMutation = useDeleteAgencyMutation({
    onSuccess: () => {
      toast.success("Agentlik o'chirildi");
      setAgencyToDelete(null);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const exportMutation = useExportAgenciesMutation({
    onError: () => toast.error("Eksport qilishda xatolik"),
  });

  const handleSubmit = (data: CreateAgencyDto) => {
    if (editingAgency) {
      updateMutation.mutate({ id: editingAgency.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

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
      <AgenciesPageHeader
        onCreate={openCreate}
        onExport={() => exportMutation.mutate()}
        exporting={exportMutation.isPending}
      />

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

      <AgencyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agency={editingAgency}
        regions={regionsQuery.data ?? []}
        loading={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!agencyToDelete}
        onOpenChange={(open) => !open && setAgencyToDelete(null)}
        title="Agentlikni o'chirish"
        description={
          agencyToDelete
            ? `${agencyToDelete.name} agentligini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`
            : ""
        }
        confirmText="O'chirish"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          agencyToDelete && deleteMutation.mutate(agencyToDelete.id)
        }
      />
    </div>
  );
}
