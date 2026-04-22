export type MonthlyFinancialRow = {
  month: string;
  releaseCap: number;
  releaseRev: number;
  expenditureCap: number;
  expenditureRev: number;
};

export type MonthlyFinancialsResponse = {
  months: MonthlyFinancialRow[];
  totals: {
    releaseCap: number;
    releaseRev: number;
    expenditureCap: number;
    expenditureRev: number;
  };
};