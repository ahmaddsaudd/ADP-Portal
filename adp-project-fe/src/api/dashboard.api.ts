import type { PipelineBoardResponse, PipelineTab } from '../types/pipeline';
import { apiClient } from './auth.api';

export async function getPipelineBoard(tab: PipelineTab) {
  const { data } = await apiClient.get<PipelineBoardResponse>(
    `/dashboard/pipeline-board?tab=${tab}`,
  );
  return data;
}