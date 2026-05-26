import React from "react";
import {InlineMessage} from "@/components/common/InlineMessage";
import {WellDetail} from "@/app/types";
import {colors} from "@/utils/constants";
import {formatYearMonth} from "@/utils/formatters";

type WellSummaryChipsProps = {
  wellDetails: WellDetail | null | undefined;
  loading: boolean;
  error: string | null;
};

export function WellSummaryChips({wellDetails, loading, error}: WellSummaryChipsProps) {
  const formatChipValue = (value: string | null | undefined): string => {
    if (!value) return "No informado";
    return value
      .trim()
      .toLocaleLowerCase("es-AR")
      .split(/\s+/)
      .map((word) => word.charAt(0).toLocaleUpperCase("es-AR") + word.slice(1))
      .join(" ");
  };

  const firstRecordLabel = formatYearMonth(wellDetails?.first_production_activity_date);
  const coverageText = firstRecordLabel || "No hay producción registrada";

  return (
    <div style={styles.stablePanelWithSurface}>
      <div style={styles.cardHeader}>
        <span className="card-label">Resumen del pozo</span>
      </div>
      {loading && <InlineMessage message="Cargando información del pozo..." />}
      {error && <InlineMessage message={error} variant="error" />}
      {!loading && !error && wellDetails && (
        <div style={styles.wellSummaryChipsWrap}>
          <div style={styles.summaryChip}>
            <span style={styles.summaryChipLabel}>Cuenca</span>
            <span style={styles.summaryChipValue}>{formatChipValue(wellDetails.watershed)}</span>
          </div>
          <div style={styles.summaryChip}>
            <span style={styles.summaryChipLabel}>Provincia</span>
            <span style={styles.summaryChipValue}>{formatChipValue(wellDetails.province)}</span>
          </div>
          <div style={styles.summaryChip}>
            <span style={styles.summaryChipLabel}>Area</span>
            <span style={styles.summaryChipValue}>{formatChipValue(wellDetails.area)}</span>
          </div>
          <div style={styles.summaryChip}>
            <span style={styles.summaryChipLabel}>Empresa</span>
            <span style={styles.summaryChipValue}>{formatChipValue(wellDetails.company)}</span>
          </div>
          <div style={styles.summaryChip}>
            <span style={styles.summaryChipLabel}>Estado</span>
            <span style={styles.summaryChipValue}>{formatChipValue(wellDetails.status)}</span>
          </div>
          <div style={styles.summaryChip}>
            <span style={styles.summaryChipLabel}>Tipo de recurso</span>
            <span style={styles.summaryChipValue}>{formatChipValue(wellDetails.resource_type)}</span>
          </div>
          <div style={styles.summaryCoverageChip}>
            <span style={styles.summaryChipLabel}>Primer registro de producción</span>
            <span style={styles.summaryChipValue}>{coverageText}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  stablePanelWithSurface: {
    minHeight: "100px",
    marginTop: "16px",
    backgroundColor: "var(--color-bg-surface)",
    padding: "14px 16px",
    borderRadius: "8px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  cardHeader: {
    paddingBottom: "12px",
    marginBottom: "12px",
    borderBottom: "1px solid var(--color-border-subtle)",
  } as React.CSSProperties,
  wellSummaryChipsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  } as React.CSSProperties,
  summaryChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-bg-sunken)",
    minHeight: "32px",
  } as React.CSSProperties,
  summaryCoverageChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-bg-sunken)",
    minHeight: "32px",
    maxWidth: "100%",
  } as React.CSSProperties,
  summaryChipLabel: {
    fontSize: "11px",
    lineHeight: 1,
    letterSpacing: "0.01em",
    color: "var(--color-text-secondary)",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  summaryChipValue: {
    fontSize: "12px",
    fontWeight: 700,
    color: colors.text,
  } as React.CSSProperties,
};
