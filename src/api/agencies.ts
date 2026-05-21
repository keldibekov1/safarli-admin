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
