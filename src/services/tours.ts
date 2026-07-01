import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  getTours,
  updateTourStatus,
  type GetToursParams,
  type Tour,
  type UpdateTourStatusDto,
} from "@/api/tours";

export const toursQueryKeys = {
  all: ["tours"] as const,
  list: (params: GetToursParams) =>
    [...toursQueryKeys.all, "list", params] as const,
};

export function useToursQuery(params: GetToursParams = {}) {
  return useQuery({
    queryKey: toursQueryKeys.list(params),
    queryFn: () => getTours(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
}

export function useUpdateTourStatusMutation(
  options?: UseMutationOptions<
    Tour,
    Error,
    { id: string; data: UpdateTourStatusDto }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTourStatusDto }) =>
      updateTourStatus(id, data),

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: toursQueryKeys.all,
      });

      await options?.onSuccess?.(...args);
    },

    onError: (...args) => {
      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      options?.onSettled?.(...args);
    },
  });
}
