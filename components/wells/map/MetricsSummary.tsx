import React from "react";
import {colors} from "@/utils/constants";

export type MetricsSummaryItem = {
  label: string;
  value: string;
  subLabel?: string;
};

export type MetricsSummaryTone = "light" | "dark";

interface MetricsSummaryProps {
  title?: string;
  items: MetricsSummaryItem[];
  loading?: boolean;
  error?: string | null;
  hint?: string;
  tone?: MetricsSummaryTone;
}

export function MetricsSummary({
  title,
  items,
  loading = false,
  error,
  hint,
  tone = "light",
}: MetricsSummaryProps) {
  const showEmptyState = !loading && !error && items.length === 0;
  const isDark = tone === "dark";

  return (
    <div style={styles.container}>
      {title && (
        <div style={{...styles.title, ...(isDark ? styles.titleDark : {})}}>{title}</div>
      )}

      {loading && (
        <div style={{...styles.loading, ...(isDark ? styles.loadingDark : {})}}>
          Cargando métricas...
        </div>
      )}

      {!loading && error && (
        <div style={styles.error}>No se pudieron cargar las métricas.</div>
      )}

      {!loading && !error && (
        <>
          {showEmptyState ? (
            <div style={{...styles.empty, ...(isDark ? styles.emptyDark : {})}}>
              Sin datos disponibles.
            </div>
          ) : (
            <div style={styles.metricsGrid}>
              {items.map((item) => (
                <div key={item.label} style={styles.metricCard}>
                  <span style={styles.metricLabel}>{item.label}</span>
                  <span style={styles.metricValue}>{item.value}</span>
                  {item.subLabel && (
                    <span style={styles.metricSubLabel}>{item.subLabel}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {hint && (
            <div style={{...styles.hint, ...(isDark ? styles.hintDark : {})}}>
              {hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  } as React.CSSProperties,
  title: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.text,
    letterSpacing: 0.4,
  } as React.CSSProperties,
  titleDark: {
    color: colors.textLight,
  } as React.CSSProperties,
  loading: {
    fontSize: 13,
    color: colors.text,
    padding: "6px 10px",
    backgroundColor: "var(--color-surface-glass-warm)",
    borderRadius: 10,
    border: "1px solid var(--color-brand-subtle)",
  } as React.CSSProperties,
  loadingDark: {
    color: colors.textLight,
    backgroundColor: "var(--color-overlay-warm-subtle)",
    border: "1px solid var(--color-overlay-warm-border)",
  } as React.CSSProperties,
  error: {
    fontSize: 13,
    color: "var(--color-text-error-strong)",
    padding: "6px 10px",
    backgroundColor: "var(--color-error-bg-light)",
    borderRadius: 10,
    border: "1px solid var(--color-error-border-light)",
  } as React.CSSProperties,
  empty: {
    fontSize: 13,
    color: "var(--color-gray-500)",
    padding: "6px 10px",
  } as React.CSSProperties,
  emptyDark: {
    color: "var(--color-overlay-warm-muted)",
  } as React.CSSProperties,
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  metricCard: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "12px 14px",
    borderRadius: "var(--radius-xl)",
    backgroundColor: "var(--color-surface-glass-warm)",
    border: "1px solid var(--color-brand-subtle)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  metricLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--color-gray-600)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  } as React.CSSProperties,
  metricValue: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.secondary,
  } as React.CSSProperties,
  metricSubLabel: {
    fontSize: 12,
    color: "var(--color-gray-500)",
  } as React.CSSProperties,
  hint: {
    fontSize: 12,
    color: "var(--color-gray-600)",
    opacity: 0.85,
  } as React.CSSProperties,
  hintDark: {
    color: colors.textLight,
    opacity: 0.8,
  } as React.CSSProperties,
} as const;
