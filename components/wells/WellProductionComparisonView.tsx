import React, {useEffect, useState} from "react";
import {colors} from "@/utils/constants";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useWellProductionComparison } from "@/hooks/useWellProductionComparison";
import { WellProductionComparisonFilters } from "@/app/types";
import { exportMultipleSheetsToExcel } from "@/utils/excel";
import { EMPTY_DATE_RANGE, DateRangeValue } from "@/utils/dateRange";
import { toast } from "react-toastify";
import { LoadingState } from "@/components/common/LoadingState";
import { InlineMessage } from "@/components/common/InlineMessage";
import {YearMonthRangeFilters} from "@/components/common/YearMonthRangeFilters";
import { useMonthlyAggregatedProduction } from "@/hooks/useMonthlyAggregatedProduction";
import { MonthlyAggregatedChart } from "@/components/production/MonthlyAggregatedChart";


const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

const formatTooltip = (value: number | string | undefined) => {
  if (typeof value === "number") {
    return value.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  return value;
};

export function WellProductionComparisonView() {
  const [wellId, setWellId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Partial<WellProductionComparisonFilters>>({median_by: []});
  const [dateRange, setDateRange] = useState<DateRangeValue>(EMPTY_DATE_RANGE);
  const [aggParams, setAggParams] = useState({
    group_by: "company",
    metric: "sum",
    fluid: "oil",
  });

  const { data: aggData, loading: aggLoading } = useMonthlyAggregatedProduction(aggParams);
  const { data, loading, error } = useWellProductionComparison(wellId, filters, dateRange);
  const errorMessage = error || null;

  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const availableGroups = aggData
    ? [...new Set(aggData.map((d: any) => d.group))].sort()
    : [];

  const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAggParams((p) => ({ ...p, group_by: e.target.value }));
    setSelectedGroup("");
  };

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

  const handleWellIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setWellId(null);
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setWellId(parsed);
      } else {
        setWellId(null);
      }
    }
  };

  const handleMedianByChange = (value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentMedianBy = prev.median_by || [];
      if (checked) {
        return { ...prev, median_by: [...currentMedianBy, value] };
      } else {
        return { ...prev, median_by: currentMedianBy.filter((v) => v !== value) };
      }
    });
  };

  const dateRangeFieldMap: Record<string, keyof DateRangeValue> = {
    inicio_anio: "startYear",
    inicio_mes: "startMonth",
    fin_anio: "endYear",
    fin_mes: "endMonth",
  };

  const updateFilters = (filterName: string, value: unknown) => {
    if (filterName in dateRangeFieldMap) {
      setDateRange((prev) => ({ ...prev, [dateRangeFieldMap[filterName]]: String(value ?? "") }));
    } else {
      setFilters((previousValues) => ({...previousValues, [filterName]: value}));
    }
  };

  const oilData = data?.data?.[0]
    ? [
        { name: "Pozo", value: data.data[0].oil.total },
        { name: "Mediana", value: data.data[0].oil.median },
      ]
    : [];

  const gasData = data?.data?.[0]
    ? [
        { name: "Pozo", value: data.data[0].gas.total },
        { name: "Mediana", value: data.data[0].gas.median },
      ]
    : [];

  const waterData = data?.data?.[0]
    ? [
        { name: "Pozo", value: data.data[0].water.total },
        { name: "Mediana", value: data.data[0].water.median },
      ]
    : [];

  const handleDownloadExcel = () => {
    if (!data || !data.data || data.data.length === 0) return;

    const dataToExport = [
      { Recurso: "Petróleo", Pozo: data.data[0].oil.total, Mediana: data.data[0].oil.median, Unidad: "m³" },
      { Recurso: "Gas", Pozo: data.data[0].gas.total, Mediana: data.data[0].gas.median, Unidad: "Mm³" },
      { Recurso: "Agua", Pozo: data.data[0].water.total, Mediana: data.data[0].water.median, Unidad: "m³" },
    ];

    const today = new Date().toISOString().split('T')[0];
    let fileName = `pozo-${wellId}`;
    if (data.start_year && data.start_month && data.end_year && data.end_month) {
      fileName += `-${data.start_year}-${data.start_month.toString().padStart(2, '0')}-a-${data.end_year}-${data.end_month.toString().padStart(2, '0')}`;
    }
    if (filters.median_by && filters.median_by.length > 0) {
      fileName += `-mediana-por-${filters.median_by.join('-')}`;
    }
    fileName += `-${today}`;

    exportMultipleSheetsToExcel([{ data: dataToExport, sheetName: "Comparación" }], fileName);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.mainTitle}>Análisis de Producción por Pozo</h2>
        {data && data.data && data.data.length > 0 && (
          <button
            onClick={handleDownloadExcel}
            style={styles.downloadButton}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-brand-dark)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-brand-mid)"; }}
          >
            📊 Descargar Excel
          </button>
        )}
      </div>

      {/* FILTROS DE POZO */}
      <div style={styles.filtersContainer}>
        <div style={styles.cardHeader}>
          <span className="card-label">Filtros</span>
        </div>
        <div style={styles.filterRow}>
          <label style={styles.label}>
            ID del Pozo:
            <input
              type="number"
              value={wellId || ""}
              onChange={handleWellIdChange}
              placeholder="Ingrese ID del pozo"
              style={styles.input}
            />
          </label>
        </div>
        <div style={styles.filterRow}>
          <YearMonthRangeFilters
            onSelect={updateFilters}
            startYearValue={dateRange.startYear}
            startMonthValue={dateRange.startMonth}
            endYearValue={dateRange.endYear}
            endMonthValue={dateRange.endMonth}
          />
        </div>
        <div style={styles.filterRow}>
          <label style={styles.checkboxLabel}>Filtrar mediana por:</label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={filters.median_by?.includes("company") || false} onChange={(e) => handleMedianByChange("company", e.target.checked)} />
            Empresa
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={filters.median_by?.includes("area") || false} onChange={(e) => handleMedianByChange("area", e.target.checked)} />
            Área
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={filters.median_by?.includes("province") || false} onChange={(e) => handleMedianByChange("province", e.target.checked)} />
            Provincia
          </label>
        </div>
      </div>

      {!wellId && !loading && (
        <InlineMessage message="Ingrese un ID de pozo para ver el análisis de producción." />
      )}

      {/* CURVA AGREGADA */}
      <div style={styles.filtersContainer}>
        <div style={styles.cardHeader}>
          <span className="card-label">Curva agregada</span>
        </div>

        <div style={styles.filterRow}>
          {/* Agrupar por */}
          <div style={selectStyles.filterGroup}>
            <label style={selectStyles.label}>
              Agrupar por
              <select style={selectStyles.select} onChange={handleGroupByChange}>
                <option value="company">Empresa</option>
                <option value="watershed">Cuenca</option>
              </select>
            </label>
          </div>

          {/* Empresa / Cuenca */}
          <div style={selectStyles.filterGroup}>
            <label style={selectStyles.label}>
              {aggParams.group_by === "company" ? "Empresa" : "Cuenca"}
              <select
                style={selectStyles.select}
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                disabled={aggLoading || availableGroups.length === 0}
              >
                <option value="">-- Seleccioná --</option>
                {availableGroups.map((g: string) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Métrica */}
          <div style={selectStyles.filterGroup}>
            <label style={selectStyles.label}>
              Métrica
              <select
                style={selectStyles.select}
                onChange={(e) => setAggParams((p) => ({ ...p, metric: e.target.value }))}
              >
                <option value="sum">Suma</option>
                <option value="avg">Promedio</option>
              </select>
            </label>
          </div>

          {/* Fluido */}
          <div style={selectStyles.filterGroup}>
            <label style={selectStyles.label}>
              Fluido
              <select
                style={selectStyles.select}
                onChange={(e) => setAggParams((p) => ({ ...p, fluid: e.target.value }))}
              >
                <option value="oil">Petróleo</option>
                <option value="gas">Gas</option>
                <option value="water">Agua</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {aggLoading && <LoadingState />}
      {aggData && aggData.length > 0 && selectedGroup && (
        <MonthlyAggregatedChart data={aggData} selectedGroup={selectedGroup} groupBy={aggParams.group_by} metric={aggParams.metric} />
      )}
      {aggData && aggData.length > 0 && !selectedGroup && (
        <InlineMessage message="Seleccioná una empresa o cuenca para ver la curva." />
      )}

      {loading && <LoadingState />}
      {errorMessage && <InlineMessage message={errorMessage || "Unexpected error"} variant="error" />}

      {data && data.data && data.data.length > 0 && (
        <div style={styles.infoContainer}>
          <div style={styles.cardHeader}>
            <span className="card-label">Contexto del pozo</span>
          </div>
          <p style={styles.info}>
            <strong>Pozo:</strong> {data.well_id} | <strong>Empresa:</strong> {data.company} |{" "}
            <strong>Área:</strong> {data.area} | <strong>Provincia:</strong> {data.province}
          </p>
          {data.start_year && data.start_month && data.end_year && data.end_month && (
            <p style={styles.info}>
              <strong>Período:</strong> {data.start_month}/{data.start_year} - {data.end_month}/{data.end_year}
            </p>
          )}
        </div>
      )}

      {data && data.data && data.data.length > 0 && (
        <div style={styles.chartsContainer}>
          <div style={styles.chartWrapper}>
            <div style={styles.cardHeader}><span className="card-label">Comparación</span></div>
            <h3 style={styles.chartTitle}>Producción de Petróleo</h3>
            <ResponsiveContainer  width="100%" height={400}>
              <BarChart data={oilData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} width={60} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" name="Petróleo (m³)">
                  <Cell fill={colors.oil} />
                  <Cell fill={colors.oil} opacity={0.6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartWrapper}>
            <div style={styles.cardHeader}><span className="card-label">Comparación</span></div>
            <h3 style={styles.chartTitle}>Producción de Gas</h3>
            <ResponsiveContainer  width="100%" height={400}>
              <BarChart data={gasData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} width={60} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" name="Gas (Mm³)">
                  <Cell fill={colors.gas} />
                  <Cell fill={colors.gas} opacity={0.6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartWrapper}>
            <div style={styles.cardHeader}><span className="card-label">Comparación</span></div>
            <h3 style={styles.chartTitle}>Producción de Agua</h3>
            <ResponsiveContainer  width="100%" height={400}>
              <BarChart data={waterData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} width={60} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" name="Agua (m³)">
                  <Cell fill={colors.water} />
                  <Cell fill={colors.water} opacity={0.6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    width: "100%",
    minHeight: "calc(100vh - 200px)",
  } as React.CSSProperties,
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  } as React.CSSProperties,
  mainTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: colors.primary,
    margin: 0,
  } as React.CSSProperties,
  downloadButton: {
    backgroundColor: "var(--color-brand-mid)",
    color: "var(--color-text-inverse)",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background-color 0.2s",
  } as React.CSSProperties,
  filtersContainer: {
    backgroundColor: colors.filtersBg,
    padding: "24px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  cardHeader: {
    paddingBottom: "12px",
    marginBottom: "12px",
    borderBottom: "1px solid var(--color-border-subtle)",
  } as React.CSSProperties,
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
    flex: "1",
    minWidth: "150px",
  } as React.CSSProperties,
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
  } as React.CSSProperties,
  input: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: `1px solid ${colors.panelBorder}`,
    fontSize: "14px",
    minWidth: "120px",
  } as React.CSSProperties,
  select: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: `1px solid ${colors.panelBorder}`,
    fontSize: "14px",
    width: "100%",
    backgroundColor: "white",
    cursor: "pointer",
  } as React.CSSProperties,
  infoContainer: {
    backgroundColor: colors.filtersBg,
    padding: "24px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  info: {
    margin: "4px 0",
    fontSize: "14px",
    color: colors.text,
  } as React.CSSProperties,
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    width: "100%",
  } as React.CSSProperties,
  chartWrapper: {
    backgroundColor: "var(--color-bg-surface)",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "var(--shadow-sm)",
    border: `1px solid ${colors.panelBorder}`,
  } as React.CSSProperties,
  chartTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: colors.primary,
    marginBottom: "16px",
    textAlign: "center",
  } as React.CSSProperties,
  message: {
    textAlign: "center",
    padding: "40px",
    fontSize: "16px",
    color: colors.text,
  } as React.CSSProperties,
  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "var(--color-error)",
    backgroundColor: "rgba(192, 57, 43, 0.08)",
    borderRadius: "8px",
    marginBottom: "20px",
  } as React.CSSProperties,
};

const selectStyles = {
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 220,
    flex: 1,
  } as React.CSSProperties,
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--color-text-secondary)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  } as React.CSSProperties,
  select: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid var(--color-border-medium)",
    backgroundColor: "var(--color-bg-sunken)",
    fontSize: 13,
    color: "var(--color-text-primary)",
    cursor: "pointer",
    minWidth: 200,
  } as React.CSSProperties,
};

export function AnalysisIcon({width = 18, height = 18}: {width?: number; height?: number}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 6v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
