import type { WellDetail } from "@/app/types";
import { colors } from "@/utils/constants";
import React from "react";
import { exportMultipleSheetsToExcel } from "@/utils/excel";
import type { WellFilters } from "@/app/types/wellFilters";
import { buildWellsExcelExport } from "@/components/wells/table/wellsExport";

interface WellsTableProps {
  data: WellDetail[];
  filters?: WellFilters;
  currentPage?: number;
  totalItems?: number;
  pageSize?: number;
}

const EMPTY_FILTERS: WellFilters = {
  watershed: "",
  province: "",
  status: "",
  company: "",
  limit: 0,
};

export function WellsTable({
  data,
  filters = EMPTY_FILTERS,
  currentPage = 0,
  totalItems = data.length,
  pageSize = data.length,
}: WellsTableProps) {
    const onMouseEnter = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.currentTarget.style.background = "var(--color-bg-sunken)";
    };

    const onMouseLeave = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.currentTarget.style.background = "transparent";
    };

    const handleDownloadExcel = () => {
        if (!data.length) return;

        const { sheets, fileName } = buildWellsExcelExport({
          data,
          filters,
          currentPage,
          totalItems,
          pageSize,
        });

        exportMultipleSheetsToExcel(
            sheets,
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
        borderRadius: "var(--radius-xl)",
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
