export type GlobalMonthlyFinancialRow = {
  id: string;
  adpNo: string;
  schemeName: string;
  monthly: {
    jul: { rel: number | null; exp: number | null };
    aug: { rel: number | null; exp: number | null };
    sep: { rel: number | null; exp: number | null };
    oct: { rel: number | null; exp: number | null };
    nov: { rel: number | null; exp: number | null };
    dec: { rel: number | null; exp: number | null };
    jan: { rel: number | null; exp: number | null };
    feb: { rel: number | null; exp: number | null };
    mar: { rel: number | null; exp: number | null };
    apr: { rel: number | null; exp: number | null };
    may: { rel: number | null; exp: number | null };
    jun: { rel: number | null; exp: number | null };
  };
  totalCfy: {
    rel: number;
    exp: number;
  };
};

export type GlobalMonthlyFinancialsResponse = {
  rows: GlobalMonthlyFinancialRow[];
};

export type GlobalPhysicalProgressRow = {
  id: string;
  adpNo: string;
  schemeName: string;
  sector: string | null;
  approvalStatus: string;
  executionStatus: string;
  completionPercentage: number;
  latestPhysicalRemark: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
};

export type GlobalPhysicalProgressResponse = {
  rows: GlobalPhysicalProgressRow[];
};