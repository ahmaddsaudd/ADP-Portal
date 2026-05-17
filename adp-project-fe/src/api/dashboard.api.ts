import type { PipelineBoardResponse, PipelineTab } from "../types/pipeline";
import { apiClient } from "./auth.api";

export async function getPipelineBoard(
  tab: PipelineTab,
  financialYear?: string
): Promise<PipelineBoardResponse> {
  const { data } = await apiClient.get<PipelineBoardResponse>(
    "/dashboard/pipeline-board",
    {
      params: { tab, financialYear },
    }
  );

  return data;
}