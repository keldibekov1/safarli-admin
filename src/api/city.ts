import { api } from "./api";

export type City = {
  id: string;
  name: string;
  nameUz: string | null;
  nameRu: string | null;
  countryId: string;

  country: {
    id: string;
    name: string;
    nameUz: string | null;
    nameRu: string | null;
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
      search: search || undefined,
      countryId: countryId || undefined,
    },
  });

  return response.data;
}

export type CreateCityDto = {
  name: string;
  nameUz?: string | null;
  nameRu?: string | null;
  countryId: string;
};

export type UpdateCityDto = CreateCityDto;

export async function createCity(data: CreateCityDto): Promise<City> {
  const response = await api.post("/city", data);

  return response.data;
}

export async function updateCity(
  id: string,
  data: UpdateCityDto,
): Promise<City> {
  const response = await api.patch(`/city/${id}`, data);

  return response.data;
}

export async function deleteCity(id: string): Promise<void> {
  await api.delete(`/city/${id}`);
}
