import { getCountries } from "@/api/countries";
import {
  keepPreviousData,
  useQuery,
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