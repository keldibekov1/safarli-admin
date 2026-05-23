import { api } from "./api";

export type City = {
  id: string;
  name: string;
  countryId: string;

  country: {
    id: string;
    name: string;
    iso2: string | null;
    iso3: string | null;
    emoji: string | null;
  };
};

export type CitiesResponse = {
  data: City[];
  total: number;
  currentPage: number;
  totalPages: number;
};

type GetCitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  countryId?: string;
};

export async function getCities({
  page = 1,
  limit = 10,
  search,
  countryId,
}: GetCitiesParams): Promise<CitiesResponse> {
  const response = await api.get("/city", {
    params: {
      page,
      limit,
      search,
      countryId,
    },
  });

  return response.data;
}

export async function deleteCity(id: string): Promise<void> {
  await api.delete(`/city/${id}`);
}