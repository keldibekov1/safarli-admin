import { api } from "@/api/api";

export type TourStatus = "PENDING" | "APPROVED" | "REJECTED";

export type TourFeatureLink = {
  id: string;
  tourId: string;
  featureId: string;
  feature: {
    id: string;
    name: string;
    sortOrder: number;
    icon: string | null;
  };
};

export type Tour = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  days: number;
  nights: number;
  viewsCount: number;
  likesCount: number;
  callClicksCount: number;
  totalSlots: number | null;
  bookedSlots: number;
  image: string | null;
  gallery: string[];
  startDate: string;
  endDate: string;
  countryId: string;
  cityId: string;
  status: TourStatus;
  rejectReason: string | null;
  agencyId: string;
  approvedByAdminId: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;

  country: {
    id: string;
    name: string;
    nameUz: string | null;
    nameRu: string | null;
    emoji: string | null;
  } | null;

  city: {
    id: string;
    name: string;
    nameUz: string | null;
    nameRu: string | null;
  } | null;

  agency: {
    id: string;
    name: string;
    logo: string | null;
    phone: string | null;
  } | null;

  features: TourFeatureLink[];
};

export type ToursResponse = {
  data: Tour[];
  total: number;
  currentPage: number;
  totalPages: number;
};

export type GetToursParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TourStatus | "";
  countryId?: string;
  cityId?: string;
  agencyId?: string;
};

export async function getTours({
  page = 1,
  limit = 10,
  search,
  status,
  countryId,
  cityId,
  agencyId,
}: GetToursParams = {}): Promise<ToursResponse> {
  const response = await api.get("/tours", {
    params: {
      page,
      limit,
      search: search || undefined,
      status: status || undefined,
      countryId: countryId || undefined,
      cityId: cityId || undefined,
      agencyId: agencyId || undefined,
    },
  });

  return response.data;
}

export type UpdateTourStatusDto = {
  status: TourStatus;
  rejectReason?: string | null;
};

export async function updateTourStatus(
  id: string,
  data: UpdateTourStatusDto,
): Promise<Tour> {
  const response = await api.patch(`/tours/${id}/status`, data);

  return response.data;
}
