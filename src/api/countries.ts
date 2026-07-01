import { api } from "./api";

export type Country = {
  id: string;
  name: string;
  nameUz: string | null;
  nameRu: string | null;
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

export type CreateCountryDto = {
  name: string;
  nameUz?: string | null;
  nameRu?: string | null;
};

export async function createCountry(
  data: CreateCountryDto,
): Promise<Country> {
  const response = await api.post("/country", data);

  return response.data;
}

export type UpdateCountryDto = CreateCountryDto;

export async function updateCountry(
  id: string,
  data: UpdateCountryDto,
): Promise<Country> {
  const response = await api.patch(`/country/${id}`, data);

  return response.data;
}

export async function deleteCountry(id: string): Promise<void> {
  await api.delete(`/country/${id}`);
}