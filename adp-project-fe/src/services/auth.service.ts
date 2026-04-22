import { apiClient } from "../api/auth.api";

export const login = async (email: string, password: string) => {
  const res = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};