import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  createTourFeature,
  deleteTourFeature,
  getTourFeatures,
  updateTourFeature,
  type CreateTourFeatureDto,
  type TourFeature,
  type UpdateTourFeatureDto,
} from "@/api/tour-features";

export const tourFeaturesQueryKeys = {
  all: ["tour-features"] as const,
};

export function useTourFeaturesQuery() {
  return useQuery({
    queryKey: tourFeaturesQueryKeys.all,
    queryFn: getTourFeatures,
  });
}

export function useCreateTourFeatureMutation(
  options?: UseMutationOptions<
    TourFeature,
    Error,
    CreateTourFeatureDto
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTourFeature,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: tourFeaturesQueryKeys.all,
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

export function useUpdateTourFeatureMutation(
  options?: UseMutationOptions<
    TourFeature,
    Error,
    { id: string; data: UpdateTourFeatureDto }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTourFeatureDto }) =>
      updateTourFeature(id, data),

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: tourFeaturesQueryKeys.all,
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

export function useDeleteTourFeatureMutation(
  options?: UseMutationOptions<
    void,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTourFeature,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey:
          tourFeaturesQueryKeys.all,
      });

      await options?.onSuccess?.(
        ...args,
      );
    },

    onError: (...args) => {
      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      options?.onSettled?.(...args);
    },
  });
}