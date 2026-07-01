import { api } from "@/api/api";

export type AgencyRegion = {
  id: string;
  name: string;
};

export type Agency = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  bannerImage: string | null;
  rating: number;
  phone: string;
  email: string;
  website: string | null;
  telegram: string | null;
  instagram: string | null;
  regionId: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  username: string;
  isActive: boolean;
  isFeatured: boolean;
  reviewsCount: number;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  region?: AgencyRegion | null;
};

export type AgenciesResponse = {
  data: Agency[];
  total: number;
  currentPage: number;
  totalPages: number;
};

export type GetAgenciesParams = {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
};

export async function getAgencies({
  page = 1,
  limit = 10,
  isActive,
  search,
}: GetAgenciesParams = {}) {
  const response = await api.get<AgenciesResponse>("/agency", {
    params: { page, limit, isActive, search },
  });

  return response.data;
}

export async function getAgency(id: string) {
  const response = await api.get<Agency>(`/agency/${id}`);

  return response.data;
}

export async function exportAgencies(): Promise<{ blob: Blob; filename: string }> {
  const response = await api.get("/agency/export", { responseType: "blob" });

  const disposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match
    ? decodeURIComponent(match[1])
    : `agencies-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return { blob: response.data as Blob, filename };
}

export type Region = {
  id: string;
  name: string;
};

export async function getRegions() {
  const response = await api.get<Region[]>("/region");

  return response.data;
}

export type CreateAgencyDto = {
  name: string;
  description: string;
  logo?: string | null;
  bannerImage?: string | null;
  phone: string;
  email: string;
  website?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  regionId: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  username: string;
  password?: string;
};

export type UpdateAgencyDto = CreateAgencyDto;

export type AgencyImageField = "logo" | "bannerImage";

export type UploadAgencyImagesResponse = {
  logo?: string;
  bannerImage?: string;
};

export async function uploadAgencyImage(
  field: AgencyImageField,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append(field, file);

  const response = await api.post<UploadAgencyImagesResponse>(
    "/upload/agency",
    formData,
  );

  const data = response.data as Record<string, unknown>;
  // Be tolerant of a few common response shapes.
  const url =
    data?.[field] ??
    data?.url ??
    data?.path ??
    (typeof response.data === "string" ? response.data : undefined);

  if (typeof url !== "string" || !url) {
    throw new Error("Yuklash javobida URL topilmadi");
  }

  return url;
}

export async function createAgency(data: CreateAgencyDto) {
  const response = await api.post<Agency>("/agency", data);

  return response.data;
}

export async function updateAgency(id: string, data: UpdateAgencyDto) {
  const response = await api.patch<Agency>(`/agency/${id}`, data);

  return response.data;
}

export async function updateAgencyStatus(id: string, isActive: boolean) {
  const response = await api.patch<Agency>(`/agency/${id}/status`, {
    isActive,
  });

  return response.data;
}

export async function deleteAgency(id: string): Promise<void> {
  await api.delete(`/agency/${id}`);
}
