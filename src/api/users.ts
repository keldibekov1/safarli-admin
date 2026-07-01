import { api } from "@/api/api";

export type User = {
  id: string;
  name: string;
  phone: string;
  password: string;
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  data: User[];
  total: number;
  currentPage: number;
  totalPages: number;
};

type GetUsersParams = {
  page?: number;
  limit?: number;
};

export async function getUsers({ page = 1, limit = 10 }: GetUsersParams = {}) {
  const response = await api.get<UsersResponse>("/users", {
    params: { page, limit },
  });

  return response.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}

export type MonthlyUserStat = {
  month: number;
  label: string;
  count: number;
};

export type MonthlyUserStats = {
  year: number;
  total: number;
  data: MonthlyUserStat[];
};

export async function getMonthlyUserStats(year: number) {
  const response = await api.get<MonthlyUserStats>("/users/stats/monthly", {
    params: { year },
  });

  return response.data;
}
