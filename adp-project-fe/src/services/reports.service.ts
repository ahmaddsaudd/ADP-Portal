
import { apiClient } from "../api/auth.api";
import type {
  GlobalMonthlyFinancialsResponse,
  GlobalPhysicalProgressResponse,
} from "../types/reports.types";

export async function getGlobalMonthlyFinancials(): Promise<GlobalMonthlyFinancialsResponse> {
  const { data } = await apiClient.get("/dashboard/reports/monthly-financials");
  return data;
}

export async function getGlobalPhysicalProgress(): Promise<GlobalPhysicalProgressResponse> {
  const { data } = await apiClient.get("/dashboard/reports/physical-progress");
  return data;
}