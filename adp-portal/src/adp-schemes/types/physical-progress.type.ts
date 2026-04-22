export type PhysicalProgressRemarkItem = {
  id: string;
  text: string;
  createdAt: string | null;
};

export type PhysicalProgressResponse = {
  overallCompletionPercentage: number;
  completedSteps: number;
  totalSteps: number;
  remarks: PhysicalProgressRemarkItem[];
};