
import { apiClient } from "../api/auth.api";
import type {
  GlobalMonthlyFinancialsResponse,
  GlobalPhysicalProgressResponse,
} from "../types/reports.types";

export async function getGlobalMonthlyFinancials(financialYear?: string): Promise<GlobalMonthlyFinancialsResponse> {
  const { data } = await apiClient.get<GlobalMonthlyFinancialsResponse>("/dashboard/reports/monthly-financials", {
    params: { financialYear },
  });

  return data;
}

export async function getGlobalPhysicalProgress(financialYear?: string): Promise<GlobalPhysicalProgressResponse> {
  const { data } = await apiClient.get<GlobalPhysicalProgressResponse>("/dashboard/reports/physical-progress", {
    params: { financialYear },
  });

  return data;
}