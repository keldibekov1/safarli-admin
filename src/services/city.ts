import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { deleteCity, getCities } from "@/api/city";

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