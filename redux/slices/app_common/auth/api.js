import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./authService";

import { API_BASE_URL } from "@env";

// console.log("API_BASE_URL:", API_BASE_URL);

// const API_BASE_URL = "http://192.168.29.198:8000/";
// const API_BASE_URL = "http://192.168.29.41:8000/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  console.log(
    "📤 API Request →",
    config.method?.toUpperCase(),
    config.baseURL + config.url
  );
  if (config.params) {
    console.log("🧭 Query Params →", config.params);
  }
  console.log("🔐 Headers →", config.headers);
  console.log("📦 Data →", config.data);
  return config;
});
api.interceptors.response.use(
  (res) => {
    console.log("✅ Response →", res.config.url, res.data);
    return res;
  },
  (err) => {
    console.log(
      "❌ API Error →",
      err.config?.url,
      err.response?.status,
      err.response?.data
    );
    return Promise.reject(err);
  }
);

api.interceptors.request.use(async (config) => {
  if (config.noAuth) {
    return config;
  }

  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        await saveTokens({ access: res.data.access, refresh: refreshToken });

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
