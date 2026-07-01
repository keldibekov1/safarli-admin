import {
  createCountry,
  getCountries,
  updateCountry,
  type Country,
  type CreateCountryDto,
  type UpdateCountryDto,
} from "@/api/countries";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";



export const countriesQueryKeys = {
  all: ["countries"] as const,

  list: ({ page, limit, search }: any) =>
    [...countriesQueryKeys.all, "list", { page, limit, search }] as const,
};

export function useCountriesQuery({
  page = 1,
  limit = 10,
  search = "",
}: any = {}) {
  return useQuery({
    queryKey: countriesQueryKeys.list({
      page,
      limit,
      search,
    }),

    queryFn: () =>
      getCountries({
        page,
        limit,
        search: search || undefined,
      }),

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
}

export function useAllCountriesQuery() {
  return useQuery({
    queryKey: [...countriesQueryKeys.all, "all"],
    queryFn: () => getCountries({ page: 1, limit: 1000 }),
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useCreateCountryMutation(
  options?: UseMutationOptions<Country, Error, CreateCountryDto>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCountry,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: countriesQueryKeys.all,
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

export function useUpdateCountryMutation(
  options?: UseMutationOptions<
    Country,
    Error,
    { id: string; data: UpdateCountryDto }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCountryDto }) =>
      updateCountry(id, data),

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: countriesQueryKeys.all,
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