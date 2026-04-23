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
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-bg-surface)",
    color: "var(--color-text-secondary)",
    fontSize: 12,
    padding: "4px 10px",
  } as React.CSSProperties,
  metaChipAlert: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    border: "1px solid var(--color-error)",
    backgroundColor: "rgba(192, 57, 43, 0.08)",
    color: "var(--color-error)",
    fontSize: 12,
    padding: "4px 10px",
  } as React.CSSProperties,
} as const;
