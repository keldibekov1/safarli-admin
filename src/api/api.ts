import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_URL ?? "https://api.safarli.uz";

export const api = axios.create({
  baseURL: API_ORIGIN,
  // baseURL: import.meta.env.VITE_API_URL ?? "https://api.avtotestzone.uz",

});

/**
 * Resolves a server-relative upload path (e.g. "/uploads/agencies/x.webp")
 * to an absolute URL. Absolute (http/data) URLs are returned unchanged.
 */
export const assetUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (/^(https?:|data:)/.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("safarli-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("safarli-token");
      localStorage.removeItem("safarli-admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
