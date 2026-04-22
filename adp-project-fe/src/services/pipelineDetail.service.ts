import { apiClient } from "../api/auth.api";
import { API_IMAGES_BASE_URL } from "../config";
import type {
  GalleryResponse,
  MonthlyFinancialsResponse,
  PhysicalProgressResponse,
  PipelineSchemeDetail,
} from "../types/pipelineDetail.types";

export async function getPipelineSchemeDetail(
  id: string
): Promise<PipelineSchemeDetail> {
  const { data } = await apiClient.get(`/adp-schemes/${id}/pipeline-detail`);
  console.log("API response for scheme detail:", data); // Debug log to verify API response
  return data;
}

export async function getSchemePhysicalProgress(
  id: string
): Promise<PhysicalProgressResponse> {
  const { data } = await apiClient.get(`/adp-schemes/${id}/physical-progress`);
  return data;
}

export async function getSchemeMonthlyFinancials(
  id: string
): Promise<MonthlyFinancialsResponse> {
  const { data } = await apiClient.get(`/adp-schemes/${id}/monthly-financials`);
  // console.log("Fetched monthly financials data:", data); // Debug log to verify financials data
  return data;
}

export async function getSchemeGallery(
  id: string
): Promise<GalleryResponse> {
  const { data } = await apiClient.get(`/adp-schemes/${id}/gallery`);
  return {
    items: (data.items || []).map((item: any) => ({
      ...item,
      imageUrl: item.imageUrl?.startsWith("http")
        ? item.imageUrl
        : `${API_IMAGES_BASE_URL}/${item.imageUrl}`,
    })),
  };
}

export async function uploadSchemeGalleryImage(
  id: string,
  payload: { file: File; caption?: string }
) {
  const formData = new FormData();
  formData.append("file", payload.file);

  if (payload.caption) {
    formData.append("caption", payload.caption);
  }

  const { data } = await apiClient.post(`/adp-schemes/${id}/gallery`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}