import { api } from "@/api/api";

export type Admin = {
  id: string;
  username: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  admin: Admin;
};

const TOKEN_KEY = "safarli-token";
const ADMIN_KEY = "safarli-admin";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdmin(): Admin | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Admin;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function setSession({ token, admin }: LoginResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export async function login(data: LoginDto) {
  const response = await api.post<LoginResponse>("/admin/login", data);
  return response.data;
}

export async function getMe() {
  const response = await api.get<Admin>("/admin/me");
  return response.data;
}

export type UpdateMeDto = {
  username: string;
  password?: string;
};

export async function updateMe(data: UpdateMeDto) {
  const response = await api.patch<Admin>("/admin/me", data);
  return response.data;
}
