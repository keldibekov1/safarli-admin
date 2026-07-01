import { api } from "@/api/api";

export type TourFeature = {
  id: string;
  name: string;
  sortOrder: number;
  icon: string | null;
};

export type CreateTourFeatureDto = {
  name: string;
};

export async function getTourFeatures() {
  const response = await api.get<TourFeature[]>("/tour-feature");

  return response.data;
}

export async function createTourFeature(
  data: CreateTourFeatureDto,
) {
  const response = await api.post<TourFeature>(
    "/tour-feature",
    data,
  );

  return response.data;
}

export type UpdateTourFeatureDto = CreateTourFeatureDto;

export async function updateTourFeature(
  id: string,
  data: UpdateTourFeatureDto,
) {
  const response = await api.patch<TourFeature>(
    `/tour-feature/${id}`,
    data,
  );

  return response.data;
}

export async function deleteTourFeature(id: string) {
  await api.delete(`/tour-feature/${id}`);
}