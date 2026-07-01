import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  createCity,
  deleteCity,
  getCities,
  updateCity,
  type City,
  type CreateCityDto,
  type UpdateCityDto,
} from "@/api/city";

type CitiesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  countryId?: string;
};

export const citiesQueryKeys = {
  all: ["cities"] as const,

  list: ({
    page,
    limit,
    search,
    countryId,
  }: Required<CitiesQueryParams>) =>
    [
      ...citiesQueryKeys.all,
      {
        page,
        limit,
        search,
        countryId,
      },
    ] as const,
};

export function useCitiesQuery({
  page = 1,
  limit = 10,
  search = "",
  countryId = "",
}: CitiesQueryParams = {}) {
  return useQuery({
    queryKey: citiesQueryKeys.list({
      page,
      limit,
      search,
      countryId,
    }),

    queryFn: () =>
      getCities({
        page,
        limit,
        search,
        countryId,
      }),
  });
}

export function useAllCitiesQuery(countryId = "") {
  return useQuery({
    queryKey: [...citiesQueryKeys.all, "all", { countryId }],
    queryFn: () =>
      getCities({ page: 1, limit: 1000, countryId }),
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useCreateCityMutation(
  options?: UseMutationOptions<City, Error, CreateCityDto>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCity,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: citiesQueryKeys.all,
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

export function useUpdateCityMutation(
  options?: UseMutationOptions<
    City,
    Error,
    { id: string; data: UpdateCityDto }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCityDto }) =>
      updateCity(id, data),

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: citiesQueryKeys.all,
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

export function useDeleteCityMutation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCity,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: citiesQueryKeys.all,
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