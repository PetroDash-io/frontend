import type { WellDetail } from "@/app/types";
import { colors } from "@/utils/constants";
import React from "react";


interface WellsTableProps {
  data: WellDetail[];
}

export function WellsTable({data}: WellsTableProps) {
    const onMouseEnter = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.currentTarget.style.background = "#f6f6f6";
    };

    const onMouseLeave = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.currentTarget.style.background = "transparent";
    };

    return (
      <div style={styles.tableContainer}>
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
                <td style={styles.cell}>{pozo.type}</td>
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
        color: "#222",
    } as React.CSSProperties,
    tableContainer: {
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        border: `1px solid ${colors.panelBorder}`,
        overflowX: "auto",
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
        borderBottom: "1px solid #eee",
    } as React.CSSProperties,
};
