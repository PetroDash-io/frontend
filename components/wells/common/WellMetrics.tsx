import React from "react";
import {MetricsSummaryItem} from "@/components/wells/map/MetricsSummary";
import {ClassificationFilter, WellFilters} from "@/app/types/wellFilters";

const CLASSIFICATION_LABEL: Record<ClassificationFilter, string> = {
  all: "Todos",
  conv: "Convencional",
  no_conv: "No convencional",
};

interface WellMetricsProps {
  items: MetricsSummaryItem[];
  loading?: boolean;
  error?: string | null;
  filters: WellFilters;
  filteredCount: number;
}

const STATUS_ORDER = ["Pozos activos", "Pozos inactivos", "Pozos parados", "No informados"];

const readableFilterValue = (value: string, fallback: string) => {
  if (!value) return fallback;
  return value;
};

export function WellMetrics({items, loading = false, error, filters, filteredCount}: WellMetricsProps) {
  const statusCards = STATUS_ORDER
    .map((label) => items.find((item) => item.label.toLowerCase() === label.toLowerCase()))
    .filter((item): item is MetricsSummaryItem => Boolean(item));

  const productionCard = items.find((item) => item.label.toLowerCase().includes("producción total"));

  const contextLine = [
    `Cuenca ${readableFilterValue(filters.watershed, "Todas")}`,
    `Provincia ${readableFilterValue(filters.province, "Todas")}`,
    `Estado ${readableFilterValue(filters.status, "Todos")}`,
    `Empresa ${readableFilterValue(filters.company, "Todas")}`,
    `Tipo ${CLASSIFICATION_LABEL[filters.classification]}`,
  ].join(" · ");

  return (
    <section style={styles.container} aria-label="Métricas de pozos">
      <div style={styles.header}>
        <h3 style={styles.title}>Resumen de pozos filtrados</h3>
        <div style={styles.metaRow}>
          <p style={styles.context}>{contextLine}</p>
          <p style={styles.count}>{filteredCount} pozos en mapa</p>
        </div>
      </div>

      {loading && <div style={styles.state}>Cargando métricas...</div>}
      {!loading && error && <div style={styles.error}>No se pudieron cargar las métricas.</div>}

      {!loading && !error && (
        <>
          {statusCards.length === 0 && !productionCard ? (
            <div style={styles.state}>Sin datos disponibles.</div>
          ) : (
            <div style={styles.cardsRow}>
              {statusCards.map((item) => (
                <article key={item.label} style={styles.card}>
                  <span style={styles.cardLabel}>{item.label}</span>
                  <span style={styles.cardValue}>{item.value}</span>
                </article>
              ))}

              {productionCard ? (
                <article key={productionCard.label} style={styles.productionCard}>
                  <span style={styles.cardLabel}>{productionCard.label}</span>
                  <span style={styles.cardValue}>{productionCard.value}</span>
                  {productionCard.subLabel ? (
                    <span style={styles.subLabel}>{productionCard.subLabel}</span>
                  ) : null}
                </article>
              ) : null}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const styles = {
  container: {
    borderRadius: 14,
    border: "1px solid var(--color-border-subtle)",
    padding: "8px 10px",
    backgroundColor: "#fffdf6",
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  title: {
    margin: 0,
    color: "var(--color-brand-primary)",
    fontSize: 16,
    fontWeight: 700,
  } as React.CSSProperties,
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
  } as React.CSSProperties,
  context: {
    margin: 0,
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.2,
  } as React.CSSProperties,
  count: {
    margin: 0,
    fontSize: 10,
    color: "#6b7280",
    fontWeight: 700,
  } as React.CSSProperties,
  cardsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  } as React.CSSProperties,
  card: {
    border: "1px solid var(--color-border-subtle)",
    borderRadius: 8,
    backgroundColor: "rgba(250,250,249,0.95)",
    padding: "6px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minHeight: 52,
    minWidth: 112,
    flex: "1 1 112px",
  } as React.CSSProperties,
  productionCard: {
    border: "1px solid #d8d2c2",
    borderRadius: 8,
    backgroundColor: "#f8f5ec",
    padding: "6px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minHeight: 52,
    minWidth: 168,
    flex: "1 1 168px",
  } as React.CSSProperties,
  cardLabel: {
    fontSize: 10,
    letterSpacing: 0.35,
    textTransform: "uppercase",
    color: "#374151",
    fontWeight: 700,
    lineHeight: 1.3,
  } as React.CSSProperties,
  cardValue: {
    fontSize: 20,
    lineHeight: 1,
    color: "var(--color-brand-mid)",
    fontWeight: 700,
  } as React.CSSProperties,
  subLabel: {
    fontSize: 10,
    color: "#6b7280",
  } as React.CSSProperties,
  state: {
    fontSize: 13,
    color: "#4b5563",
    padding: "6px 4px",
  } as React.CSSProperties,
  error: {
    fontSize: 13,
    color: "#b91c1c",
    padding: "6px 4px",
  } as React.CSSProperties,
} as const;
