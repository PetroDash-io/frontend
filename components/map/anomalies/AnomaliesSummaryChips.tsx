import React from "react";

interface AnomaliesSummaryChipsProps {
  seriesCount: number;
  rangeLabel: string;
  anomalyCount: number;
}

export function AnomaliesSummaryChips({seriesCount, rangeLabel, anomalyCount}: AnomaliesSummaryChipsProps) {
  return (
    <div style={styles.metaRow}>
      <span style={styles.metaChip}>Serie: {seriesCount}</span>
      <span style={styles.metaChip}>Ventana: {rangeLabel}</span>
      <span style={styles.metaChipAlert}>Anomalias detectadas: {anomalyCount}</span>
    </div>
  );
}

const styles = {
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  } as React.CSSProperties,
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    border: "1px solid #d8cdbf",
    backgroundColor: "#f7f3ec",
    color: "#4b2a1a",
    fontSize: 12,
    padding: "4px 10px",
  } as React.CSSProperties,
  metaChipAlert: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    border: "1px solid #f0b6a8",
    backgroundColor: "#fff3ee",
    color: "#9f2f1f",
    fontSize: 12,
    padding: "4px 10px",
  } as React.CSSProperties,
} as const;
