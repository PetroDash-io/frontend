import type { WellDetail } from "@/app/types";
import type { ClassificationFilter } from "@/app/types/wellFilters";

export type WellClassification = "conv" | "no_conv" | "unknown";

export function classifyWell(well: WellDetail): WellClassification {
  const rt = well.resource_type?.toUpperCase().trim();
  if (rt === "NO CONVENCIONAL") return "no_conv";
  if (!rt || rt === "NO INFORMADO" || rt === "SIN RESERVORIO") return "unknown";
  return "conv";
}

export const CLASSIFICATION_API_PARAM: Record<Exclude<ClassificationFilter, "all">, string> = {
  conv: "CONVENCIONAL",
  no_conv: "NO CONVENCIONAL",
};

export const CLASSIFICATION_ARIA_LABEL: Record<WellClassification, string> = {
  conv: "convencional",
  no_conv: "no convencional",
  unknown: "sin información",
};

export const CLASSIFICATION_DISPLAY_LABEL: Record<ClassificationFilter, string> = {
  all: "Todos",
  conv: "Convencional",
  no_conv: "No convencional",
};
