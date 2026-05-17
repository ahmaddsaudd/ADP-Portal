export const FINANCIAL_YEARS = ["2024-25", "2025-26", "2026-27"];

export const DEFAULT_FINANCIAL_YEAR = "2025-26";

export function getSelectedFinancialYear() {
  return localStorage.getItem("selectedFinancialYear") || DEFAULT_FINANCIAL_YEAR;
}