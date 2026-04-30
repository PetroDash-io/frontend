import React, {useMemo, useState} from "react";
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
import {ProductionResource, WellProductionComparisonFilters} from "@/app/types";
import { LoadingState } from "@/components/common/LoadingState";
import { InlineMessage } from "@/components/common/InlineMessage";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {ProductionCurveChart} from "@/components/wells/ProductionCurveChart";
import {InjectionCurveChart} from "@/components/wells/InjectionCurveChart";
import {DateRangeFilters} from "@/components/map/DateRangeFilters";
import {
  DateRangeValue,
  DEFAULT_WELL_CHART_DATE_RANGE,
  getDateRangeCompleteness, getDateRangeWarningMessage,
  getValidatedDateRange
} from "@/utils/dateRange";
import {useWellAnomalies} from "@/hooks/useWellAnomalies";
import {WellAnomaliesChart} from "@/components/map/anomalies/WellAnomaliesChart";
import {AnomalyMethodInfoButton} from "@/components/map/anomalies/AnomalyMethodInfoButton";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";

const resourceOptions: SelectFilterOption[] = [
  {value: "oil", label: "Petroleo"},
  {value: "gas", label: "Gas"},
  {value: "water", label: "Agua"},
];

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
  const [wellIdInput, setWellIdInput] = useState("");
  const [wellIdInputError, setWellIdInputError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<WellProductionComparisonFilters>>({median_by: []});
  const [dateRange, setDateRange] = useState<DateRangeValue>(DEFAULT_WELL_CHART_DATE_RANGE);
  const [selectedResource, setSelectedResource] = useState<ProductionResource>("oil");
  const validatedDateRange = useMemo(() => getValidatedDateRange(dateRange), [dateRange]);
  const {isStartRangeIncomplete, isEndRangeIncomplete} = useMemo(
      () => getDateRangeCompleteness(dateRange),
      [dateRange]
  );

  const {
    data: comparisonData,
    loading: loadingComparisonData,
    error: errorInComparisonData
  } = useWellProductionComparison(wellId, filters, validatedDateRange);

  const {
    data: wellProduction,
    loading: loadingWellProduction,
    error: errorInWellProduction
  } = useWellsProduction({wellId: wellId, dateRange: validatedDateRange});

  const {
    data: anomalyPeriods,
    loading: loadingAnomalies,
    error: errorAnomalies
  } = useWellAnomalies({wellId: wellId, resource: selectedResource, dateRange: validatedDateRange});

  const handleApplyWellId = () => {
    const value = wellIdInput.trim();
    if (value === "") {
      setWellId(null);
      setWellIdInputError(null);
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setWellId(parsed);
      setWellIdInputError(null);
      return;
    }

    setWellIdInputError("Ingresá un ID de pozo válido.");
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

  const updateDateRange = (filterName: string, value: unknown) => {
    setDateRange((previousValues) => ({...previousValues, [filterName]: value}));
  }

  const updateSelectedResource = (filterName: string, value: unknown) => {
    setSelectedResource("oil");
  }

  const curveSeriesData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) return [];
    return wellProduction
      .slice()
      .sort((a, b) => a.data_date.localeCompare(b.data_date))
      .map((record) => ({
        date: record.data_date.slice(0, 7),
        oil: Number(record.oil_production) || 0,
        gas: Number(record.gas_production) || 0,
        water: Number(record.water_production) || 0,
        water_injection: Number(record.water_injection) || 0,
        gas_injection: Number(record.gas_injection) || 0,
        co2_injection: Number(record.co2_injection) || 0,
      }));
  }, [wellProduction]);

  // Preparar datos para los gráficos
  const oilData = comparisonData?.data?.[0]
    ? [
        { name: "Pozo", value: comparisonData.data[0].oil.total },
        { name: "Mediana", value: comparisonData.data[0].oil.median },
      ]
    : [];

  const gasData = comparisonData?.data?.[0]
    ? [
        { name: "Pozo", value: comparisonData.data[0].gas.total },
        { name: "Mediana", value: comparisonData.data[0].gas.median },
      ]
    : [];

  const waterData = comparisonData?.data?.[0]
    ? [
        { name: "Pozo", value: comparisonData.data[0].water.total },
        { name: "Mediana", value: comparisonData.data[0].water.median },
      ]
    : [];


  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.mainTitle}>Análisis de Producción por Pozo</h2>
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.cardHeader}>
          <span className="card-label">Filtros</span>
        </div>
        <div style={styles.filterRow}>
          <div style={styles.wellIdFieldContainer}>
            <label style={styles.label}>
              ID del Pozo:
              <input
                type="number"
                value={wellIdInput}
                onChange={(e) => {
                  setWellIdInput(e.target.value);
                  if (wellIdInputError) setWellIdInputError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyWellId();
                  }
                }}
                placeholder="Ingrese ID del pozo"
                style={styles.input}
              />
            </label>
          </div>
          <button type="button" style={styles.searchButton} onClick={handleApplyWellId}>
            Buscar
          </button>
        </div>

        {wellIdInputError && <InlineMessage message={wellIdInputError} variant="warning" />}

        <div style={styles.filterRow}>
          <DateRangeFilters
              value={dateRange}
              onChange={updateDateRange}
              isStartRangeIncomplete={isStartRangeIncomplete}
              isEndRangeIncomplete={isEndRangeIncomplete}
          />
        </div>
        {(isStartRangeIncomplete || isEndRangeIncomplete) && (
            <InlineMessage
                variant="warning"
                message={getDateRangeWarningMessage(isStartRangeIncomplete, isEndRangeIncomplete)}
            />
        )}
      </div>

      {!wellId && !loadingComparisonData && <InlineMessage message="Ingrese un ID de pozo para ver el análisis de producción." />}

      {wellId && (
        <>
          <div style={styles.stablePanelWithSurface}>
            <div style={styles.cardHeader}>
              <span className="card-label">Curva de producción</span>
            </div>
            {loadingWellProduction && <LoadingState/>}
            {errorInWellProduction && <InlineMessage message={errorInWellProduction} variant="error"/>}
            {!loadingWellProduction && !errorInWellProduction && curveSeriesData.length === 0 && (
              <InlineMessage message="No hay curvas de producción para este pozo." />
            )}
            {!loadingWellProduction && !errorInWellProduction && curveSeriesData.length > 0 && (
              <ProductionCurveChart data={curveSeriesData} />
            )}
          </div>

          <div style={styles.stablePanelLarge}>
            <div style={styles.cardHeader}>
              <span className="card-label">Comparación</span>
            </div>

            <div style={styles.filterRow}>
              <label style={styles.checkboxLabel}>
                Filtrar mediana por:
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.median_by?.includes("company") || false}
                  onChange={(e) => handleMedianByChange("company", e.target.checked)}
                />
                Empresa
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.median_by?.includes("area") || false}
                  onChange={(e) => handleMedianByChange("area", e.target.checked)}
                />
                Área
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.median_by?.includes("province") || false}
                  onChange={(e) => handleMedianByChange("province", e.target.checked)}
                />
                Provincia
              </label>
            </div>

            {loadingComparisonData && <LoadingState/>}
            {errorInComparisonData && <InlineMessage message={errorInComparisonData || "Unexpected error"} variant="error"/>}

            {comparisonData && comparisonData.data && comparisonData.data.length > 0 && (
              <div style={styles.infoContainer}>
                <p style={styles.info}>
                  <strong>Pozo:</strong> {comparisonData.well_id} | <strong>Empresa:</strong> {comparisonData.company} |{" "}
                  <strong>Área:</strong> {comparisonData.area} | <strong>Provincia:</strong> {comparisonData.province}
                </p>
                {comparisonData.start_year && comparisonData.start_month && comparisonData.end_year && comparisonData.end_month && (
                  <p style={styles.info}>
                    <strong>Período:</strong> {comparisonData.start_month}/{comparisonData.start_year} - {comparisonData.end_month}/{comparisonData.end_year}
                  </p>
                )}
              </div>
            )}

            <div style={styles.chartsContainer}>
              <div style={styles.chartWrapper}>
                <h3 style={styles.chartTitle}>Producción de Petróleo</h3>
                <ResponsiveContainer width="100%" height={400}>
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
                <h3 style={styles.chartTitle}>Producción de Gas</h3>
                <ResponsiveContainer width="100%" height={400}>
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
                <h3 style={styles.chartTitle}>Producción de Agua</h3>
                <ResponsiveContainer width="100%" height={400}>
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
          </div>

          <div style={styles.stablePanelWithSurface}>
            <div style={styles.cardHeader}>
              <span className="card-label">Anomalías</span>
              <AnomalyMethodInfoButton />
            </div>
            <div style={styles.filterRow}>
              <SelectFilter
                  value={selectedResource}
                  onSelect={updateSelectedResource}
                  filterName="selectedResource"
                  inputLabel="Recurso"
                  options={resourceOptions}
              />
            </div>
            {loadingAnomalies && <LoadingState/>}
            {errorAnomalies && <InlineMessage message={errorAnomalies} variant="error"/>}
            {!loadingAnomalies && !errorAnomalies && anomalyPeriods.length === 0 && (
                <InlineMessage message="No hay curvas de producción para este pozo." />
            )}
            {!loadingAnomalies && !errorAnomalies && anomalyPeriods.length > 0 && (
                <WellAnomaliesChart
                    production={wellProduction}
                    anomalyPeriods={anomalyPeriods}
                    resource={selectedResource}
                />
            )}
          </div>

          <div style={styles.stablePanelWithSurface}>
            <div style={styles.cardHeader}>
              <span className="card-label">Curva de inyección</span>
            </div>
            {loadingWellProduction && <LoadingState/>}
            {errorInWellProduction && <InlineMessage message={errorInWellProduction} variant="error"/>}
            {!loadingWellProduction && !errorInWellProduction && curveSeriesData.length === 0 && (
              <InlineMessage message="No hay curvas de inyección para este pozo." />
            )}
            {!loadingWellProduction && !errorInWellProduction && curveSeriesData.length > 0 && (
              <InjectionCurveChart data={curveSeriesData} />
            )}
          </div>
        </>
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
    alignItems: "flex-end",
    flexWrap: "wrap",
  } as React.CSSProperties,
  wellIdFieldContainer: {
    flex: 1,
    minWidth: "150px",
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
  searchButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    height: "40px",
    backgroundColor: "var(--color-brand-primary)",
    color: "var(--color-text-inverse)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-end",
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
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "none",
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
  curvesSection: {
    backgroundColor: "var(--color-bg-surface)",
    padding: "24px",
    borderRadius: "8px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
    marginTop: "24px",
  } as React.CSSProperties,
  stablePanel: {
    minHeight: "420px",
    marginTop: "24px",
  } as React.CSSProperties,
  stablePanelWithSurface: {
    minHeight: "420px",
    marginTop: "24px",
    backgroundColor: "var(--color-bg-surface)",
    padding: "24px",
    borderRadius: "8px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  stablePanelLarge: {
    minHeight: "520px",
    marginTop: "24px",
    backgroundColor: "var(--color-bg-surface)",
    padding: "24px",
    borderRadius: "8px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
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
