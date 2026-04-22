import { apiClient } from "../api/auth.api";
import type { DashboardResponse } from "../types/dashboard.types";

export const getDashboardData = async (): Promise<DashboardResponse> => {
  const response = await apiClient.get("/dashboard/overview");
  return response.data;
};