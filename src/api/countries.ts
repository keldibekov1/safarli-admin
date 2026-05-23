import { api } from "./api";

export type Country = {
  id: string;
  name: string;
  iso2: string | null;
  iso3: string | null;
  emoji: string | null;
};

export type CountriesResponse = {
  data: Country[];
  total: number;
  currentPage: number;
  totalPages: number;
};

type GetCountriesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getCountries({
  page = 1,
  limit = 10,
  search,
}: GetCountriesParams): Promise<CountriesResponse> {
  const response = await api.get("/country", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
}

export async function deleteCountry(id: string): Promise<void> {
  await api.delete(`/country/${id}`);
}