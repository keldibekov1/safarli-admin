import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  baseURL: import.meta.env.VITE_API_URL ?? "https://api.avtotestzone.uz",

});
