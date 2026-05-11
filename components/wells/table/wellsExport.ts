import type { WellDetail } from "@/app/types";
import type { WellFilters } from "@/app/types/wellFilters";
import { toSlug } from "@/utils/helpers";

type WellsExportParams = {
  data: WellDetail[];
  filters: WellFilters;
  currentPage: number;
  totalItems: number;
  pageSize: number;
};

export const buildWellsExcelExport = ({
  data,
  filters,
  currentPage,
  totalItems,
  pageSize,
}: WellsExportParams) => {
  const dataToExport = data.map((pozo) => ({
    "ID Pozo": pozo.well_id,
    Empresa: pozo.company || "",
    Provincia: pozo.province || "",
    Cuenca: pozo.watershed || "",
    Area: pozo.area || "",
    Yacimiento: pozo.field || "",
    Estado: pozo.status || "",
    "Tipo de Recurso": pozo.resource_type || "",
    "Tipo de pozo": pozo.well_type || "",
    Profundidad: pozo.depth ?? "",
    Formacion: pozo.formation || "",
    Clasificacion: pozo.classification || "",
  }));

  const filterSheet = [
    { Filtro: "Cuenca", Valor: filters.watershed || "Todas" },
    { Filtro: "Provincia", Valor: filters.province || "Todas" },
    { Filtro: "Estado", Valor: filters.status || "Todos" },
    { Filtro: "Empresa", Valor: filters.company || "Todas" },
    { Filtro: "Limite", Valor: String(pageSize) },
    { Filtro: "Pagina", Valor: String(currentPage + 1) },
    { Filtro: "Total", Valor: String(totalItems) },
  ];

  const today = new Date().toISOString().split("T")[0];
  const watershedSlug = toSlug(filters.watershed) || "todas";
  const provinceSlug = toSlug(filters.province);
  const statusSlug = toSlug(filters.status);
  const companySlug = toSlug(filters.company);

  let fileName = `pozos-${watershedSlug}`;
  if (provinceSlug) fileName += `-prov-${provinceSlug}`;
  if (statusSlug) fileName += `-estado-${statusSlug}`;
  if (companySlug) fileName += `-empresa-${companySlug}`;
  fileName += `-pagina-${currentPage + 1}-${today}`;

  return {
    sheets: [
      { data: dataToExport, sheetName: "Pozos" },
      { data: filterSheet, sheetName: "Filtros" },
    ],
    fileName,
  };
};
