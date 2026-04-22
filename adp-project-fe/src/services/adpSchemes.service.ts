import { apiClient } from "../api/auth.api";
import type {
  AdpSchemeCostingFormValues,
  AdpSchemeDetail,
  AdpSchemeFormValues,
  AdpSchemeListItem,
} from "../types/adpScheme.types";

const pickCurrentFyCosting = (costings: any[] = []) => {
  if (!Array.isArray(costings) || costings.length === 0) return null;

  const currentFy = "2025-2026";
  return costings.find((c) => c.financialYear === currentFy) || costings[0];
};

export const getAdpSchemes = async (): Promise<AdpSchemeListItem[]> => {
  const response = await apiClient.get("/adp-schemes");
  const rows = Array.isArray(response.data) ? response.data : response.data.data;

  return rows.map((item: any) => {
    const costing = pickCurrentFyCosting(item.costings);

    return {
      id: item.id,
      adpNo: item.adpNo,
      schemeName: item.schemeName,
      district: item.district,
      sector: item.sector,
      type: item.type,
      subType: item.subType,
      approvalStatus: item.approvalStatus,
      executionStatus: item.executionStatus,
      initialApprovalDate: item.initialApprovalDate,
      targetDate: item.targetDate,

      estimatedCostCap: costing?.estimatedCostCap ?? 0,
      estimatedCostRev: costing?.estimatedCostRev ?? 0,
      estimatedCostTotal: costing?.estimatedCostTotal ?? 0,

      priorExpCap: costing?.priorExpCap ?? 0,
      priorExpRev: costing?.priorExpRev ?? 0,
      priorExpTotal: costing?.priorExpTotal ?? 0,

      throwForwardCap: costing?.throwForwardCap ?? 0,
      throwForwardRev: costing?.throwForwardRev ?? 0,
      throwForwardTotal: costing?.throwForwardTotal ?? 0,

      allocCfyCap: costing?.allocCfyCap ?? 0,
      allocCfyRev: costing?.allocCfyRev ?? 0,
      allocCfyTotal: costing?.allocCfyTotal ?? 0,

      revAllocCfyCap: costing?.revAllocCfyCap ?? 0,
      revAllocCfyRev: costing?.revAllocCfyRev ?? 0,
      revAllocCfyTotal: costing?.revAllocCfyTotal ?? 0,

      releasesCfyCap: costing?.releasesCfyCap ?? 0,
      releasesCfyRev: costing?.releasesCfyRev ?? 0,
      releasesCfyTotal: costing?.releasesCfyTotal ?? 0,
    };
  });
};

export const getAdpSchemeById = async (
  id: string
): Promise<AdpSchemeDetail> => {
  const response = await apiClient.get(`/adp-schemes/${id}`);
  return response.data;
};

export const createAdpScheme = async (payload: AdpSchemeFormValues) => {
  const response = await apiClient.post("/adp-schemes", payload);
  return response.data;
};

export const updateAdpScheme = async (
  id: string,
  payload: Partial<AdpSchemeFormValues>
) => {
  const response = await apiClient.patch(`/adp-schemes/${id}`, payload);
  return response.data;
};

export const createAdpSchemeCosting = async (
  schemeId: string,
  payload: AdpSchemeCostingFormValues
) => {
  const response = await apiClient.post(
    `/adp-schemes/${schemeId}/costings`,
    payload
  );
  return response.data;
};

export const updateAdpSchemeCosting = async (
  costingId: string,
  payload: Partial<AdpSchemeCostingFormValues>
) => {
  const response = await apiClient.patch(
    `/adp-schemes/costings/${costingId}`,
    payload
  );
  return response.data;
};