import type { WellDetail } from "@/app/types";
import { colors } from "@/utils/constants";
import React from "react";
import { exportMultipleSheetsToExcel } from "@/utils/excel";
import type { WellFilters } from "@/app/types/wellFilters";


interface WellsTableProps {
  data: WellDetail[];
  filters: WellFilters;
  currentPage: number;
  totalItems: number;
  pageSize: number;
}

const normalizeValue = (value?: string | null) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const toSlug = (value?: string | null) => {
  const normalized = normalizeValue(value) || "";
  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export function WellsTable({data, filters, currentPage, totalItems, pageSize}: WellsTableProps) {
    const onMouseEnter = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.currentTarget.style.background = "var(--color-bg-sunken)";
    };

    const onMouseLeave = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.currentTarget.style.background = "transparent";
    };

    const handleDownloadExcel = () => {
        if (!data.length) return;

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

        exportMultipleSheetsToExcel(
            [
                { data: dataToExport, sheetName: "Pozos" },
                { data: filterSheet, sheetName: "Filtros" },
            ],
            fileName
        );
    };

    return (
      <div style={styles.tableContainer}>
        <div style={styles.cardHeader}>
          <span className="card-label">Listado de pozos</span>
          <button
            type="button"
            onClick={handleDownloadExcel}
            style={styles.downloadButton}
            disabled={!data.length}
          >
            📊 Descargar Excel
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
                <th key="ID Pozo" style={styles.headerCell}> ID Pozo </th>
                <th key="Empresa" style={styles.headerCell}> Empresa </th>
                <th key="Provincia" style={styles.headerCell}> Provincia </th>
                <th key="Cuenca" style={styles.headerCell}> Cuenca </th>
                <th key="Área" style={styles.headerCell}> Área </th>
                <th key="Yacimiento" style={styles.headerCell}> Yacimiento </th>
                <th key="Estado" style={styles.headerCell}> Estado </th>
                <th key="Tipo de Recurso" style={styles.headerCell}> Tipo de Recurso </th>
                <th key="Tipo de pozo" style={styles.headerCell}> Tipo de pozo </th>
                <th key="Profundidad" style={styles.headerCell}> Profundidad </th>
                <th key="Formación" style={styles.headerCell}> Formación </th>
                <th key="Clasificación" style={styles.headerCell}> Clasificación </th>
            </tr>
          </thead>
  
          <tbody>
            {data.map((pozo) => (
              <tr key={pozo.well_id} style={styles.row} onMouseEnter={onMouseEnter}  onMouseLeave={onMouseLeave}>
                <td style={styles.cell}>{pozo.well_id}</td>
                <td style={styles.cell}>{pozo.company}</td>
                <td style={styles.cell}>{pozo.province}</td>
                <td style={styles.cell}>{pozo.watershed}</td>
                <td style={styles.cell}>{pozo.area}</td>
                <td style={styles.cell}>{pozo.field}</td>
                <td style={styles.cell}>{pozo.status}</td>
                <td style={styles.cell}>{pozo.resource_type}</td>
                <td style={styles.cell}>{pozo.well_type}</td>
                <td style={styles.cell}>{pozo.depth}</td>
                <td style={styles.cell}>{pozo.formation}</td>
                <td style={styles.cell}>{pozo.classification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

const styles = {
    cell: {
        padding: "8px",
        whiteSpace: "nowrap",
        color: "var(--color-text-primary)",
    } as React.CSSProperties,
    tableContainer: {
        background: "var(--color-bg-surface)",
        borderRadius: 12,
        padding: 24,
        border: `1px solid ${colors.panelBorder}`,
        overflowX: "auto",
        boxShadow: "var(--shadow-sm)",
    } as React.CSSProperties,
    cardHeader: {
      paddingBottom: 12,
      marginBottom: 8,
      borderBottom: "1px solid var(--color-border-subtle)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    } as React.CSSProperties,
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13
    } as React.CSSProperties,
    headerCell: {
        textAlign: "left",
        padding: "10px 8px",
        borderBottom: `2px solid ${colors.panelBorder}`,
        color: colors.text,
        whiteSpace: "nowrap",
    } as React.CSSProperties,
    row: {
        cursor: "pointer",
        borderBottom: "1px solid var(--color-border-subtle)",
    } as React.CSSProperties,
    downloadButton: {
      backgroundColor: "var(--color-brand-mid)",
      color: "var(--color-text-inverse)",
      border: "none",
      borderRadius: 8,
      padding: "8px 14px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
    } as React.CSSProperties,
};
