import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createAgency,
  deleteAgency,
  exportAgencies,
  getAgencies,
  getAgency,
  getRegions,
  updateAgency,
  updateAgencyStatus,
  type Agency,
  type CreateAgencyDto,
  type GetAgenciesParams,
  type UpdateAgencyDto,
} from "@/api/agencies";

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

export function useAllAgenciesQuery() {
  return useQuery({
    queryKey: [...agenciesQueryKeys.all, "all"],
    queryFn: () => getAgencies({ page: 1, limit: 1000 }),
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useExportAgenciesMutation(
  options?: UseMutationOptions<void, Error, void>,
) {
  return useMutation({
    mutationFn: async () => {
      const { blob, filename } = await exportAgencies();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    ...options,
  });
}

export function useAgencyQuery(id: string) {
  return useQuery({
    queryKey: [...agenciesQueryKeys.all, "detail", id],
    queryFn: () => getAgency(id),
    enabled: !!id,
  });
}

export const regionsQueryKey = ["regions"] as const;

export function useRegionsQuery() {
  return useQuery({
    queryKey: regionsQueryKey,
    queryFn: getRegions,
    staleTime: 5 * 60_000,
  });
}

export function useCreateAgencyMutation(
  options?: UseMutationOptions<Agency, Error, CreateAgencyDto>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgency,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: agenciesQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => options?.onError?.(...args),
    onSettled: (...args) => options?.onSettled?.(...args),
  });
}

export function useUpdateAgencyMutation(
  options?: UseMutationOptions<
    Agency,
    Error,
    { id: string; data: UpdateAgencyDto }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgencyDto }) =>
      updateAgency(id, data),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: agenciesQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => options?.onError?.(...args),
    onSettled: (...args) => options?.onSettled?.(...args),
  });
}

export function useUpdateAgencyStatusMutation(
  options?: UseMutationOptions<
    Agency,
    Error,
    { id: string; isActive: boolean }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAgencyStatus(id, isActive),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: agenciesQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => options?.onError?.(...args),
    onSettled: (...args) => options?.onSettled?.(...args),
  });
}

export function useDeleteAgencyMutation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAgency,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: agenciesQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => options?.onError?.(...args),
    onSettled: (...args) => options?.onSettled?.(...args),
  });
}
