export type PhysicalProgressRemarkItem = {
  id: string;
  comment: string;
  commentedBy?: string;
  createdAt: string | null;
};

export type PhysicalProgressResponse = {
  overallCompletionPercentage: number;
  completedSteps: number;
  totalSteps: number;
  remarks: PhysicalProgressRemarkItem[];
};