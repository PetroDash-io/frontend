import type { WellFilters } from "@/app/types/wellFilters";
import { CLASSIFICATION_API_PARAM } from "@/utils/wellClassification";

export function buildWellFilterParams(filters: WellFilters): URLSearchParams {
  const params = new URLSearchParams();
  params.append("watershed", filters.watershed);
  if (filters.company) params.append("company", filters.company);
  if (filters.province) params.append("province", filters.province);
  if (filters.status) params.append("status", filters.status);
  const resource_type = filters.classification !== "all"
    ? CLASSIFICATION_API_PARAM[filters.classification]
    : undefined;
  if (resource_type) params.append("resource_type", resource_type);
  return params;
}
