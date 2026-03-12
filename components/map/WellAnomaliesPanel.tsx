import React, {useMemo, useState} from "react";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {MONTHS, PRODUCTION_TYPES, YEARS} from "@/utils/constants";
import {convertValueToUnit, UNITS} from "@/utils/units";
import {useUnit} from "@/hooks/useUnit";
import {useWellAnomalies} from "@/hooks/useWellAnomalies";
import {ProductionMonthly} from "@/app/types";
import {ProductionResource} from "@/app/types/anomalies";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis} from "recharts";

interface WellAnomaliesPanelProps {
  selectedWellId: string | null;
}

interface ValidatedAnomalyDateRange {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}

interface ChartDataPoint {
  date: string;
  dateTs: number;
  resourceProduction: number;
  anomalyMarker: number | null;
}

interface DatasetSummary {
  count: number;
  start: string;
  end: string;
}

interface RangeWindow {
  start: string;
  end: string;
}

const resourceOptions: SelectFilterOption[] = [
  {value: "oil", label: "Petroleo"},
  {value: "gas", label: "Gas"},
  {value: "water", label: "Agua"},
];

const EMPTY_DATE_RANGE: ValidatedAnomalyDateRange = {
  startYear: "2023",
  startMonth: "1",
  endYear: "2025",
  endMonth: "6",
};

const getValidatedRange = (inputs: ValidatedAnomalyDateRange): ValidatedAnomalyDateRange => {
  const hasStartYear = Boolean(inputs.startYear);
  const hasStartMonth = Boolean(inputs.startMonth);
  const hasEndYear = Boolean(inputs.endYear);
  const hasEndMonth = Boolean(inputs.endMonth);

  return {
    startYear: hasStartYear && hasStartMonth ? inputs.startYear : "",
    startMonth: hasStartYear && hasStartMonth ? inputs.startMonth : "",
    endYear: hasEndYear && hasEndMonth ? inputs.endYear : "",
    endMonth: hasEndYear && hasEndMonth ? inputs.endMonth : "",
  };
};

const formatYearMonth = (year: string, month: string) => `${year}-${month.padStart(2, "0")}`;

const toMonthTimestamp = (year: string, month: string) => new Date(Number(year), Number(month) - 1, 1).getTime();

export function WellAnomaliesPanel({
  selectedWellId,
}: WellAnomaliesPanelProps) {
  const [selectedResource, setSelectedResource] = useState<ProductionResource>("oil");
  const [chartDateInputs, setChartDateInputs] = useState<ValidatedAnomalyDateRange>(EMPTY_DATE_RANGE);
  const {unit, setUnit} = useUnit();
  const validatedDateRange = useMemo(() => getValidatedRange(chartDateInputs), [chartDateInputs]);

  const hasStartYear = Boolean(chartDateInputs.startYear);
  const hasStartMonth = Boolean(chartDateInputs.startMonth);
  const hasEndYear = Boolean(chartDateInputs.endYear);
  const hasEndMonth = Boolean(chartDateInputs.endMonth);
  const isStartRangeIncomplete = hasStartYear !== hasStartMonth;
  const isEndRangeIncomplete = hasEndYear !== hasEndMonth;

  const {
    data: anomalyProduction,
    loading: loadingAnomalyProduction,
    error: errorAnomalyProduction,
  } = useWellsProduction({
    wellId: selectedWellId,
    dateRange: validatedDateRange,
  });

  const {data: anomalyPeriods, loading: loadingAnomalies, error: errorAnomalies} = useWellAnomalies({
    wellId: selectedWellId,
    resource: selectedResource,
    dateRange: validatedDateRange,
  });

  const loading = loadingAnomalyProduction || loadingAnomalies;
  const error = errorAnomalyProduction || errorAnomalies;

  const anomalyDateSet = useMemo(() => {
    if (!anomalyPeriods || anomalyPeriods.length === 0) {
      return new Set<string>();
    }

    const filteredPeriods = anomalyPeriods.filter((period) => period.anomaly?.is_anomaly === true);

    return new Set(filteredPeriods.map((period) => period.reported_period_date.slice(0, 7)));
  }, [anomalyPeriods]);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!anomalyProduction || anomalyProduction.length === 0) return [];

    const resourceFieldByName: Record<ProductionResource, keyof ProductionMonthly> = {
      oil: "oil_production",
      gas: "gas_production",
      water: "water_production",
    };

    const selectedResourceField = resourceFieldByName[selectedResource];

    return anomalyProduction
      .slice()
      .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date))
      .map((period) => {
        const rawValue = Number(period[selectedResourceField] || 0);
        const convertedValue =
          selectedResource === "gas" ? rawValue : convertValueToUnit(rawValue, unit);
        const date = period.reported_period_date.slice(0, 7);

        return {
          date,
          dateTs: new Date(period.reported_period_date).getTime(),
          resourceProduction: convertedValue,
          anomalyMarker: anomalyDateSet.has(date) ? convertedValue : null,
        };
      });
  }, [anomalyProduction, selectedResource, unit, anomalyDateSet]);

  const productionSummary = useMemo<DatasetSummary>(() => {
    const count = anomalyProduction?.length ?? 0;
    if (!anomalyProduction || count === 0) {
      return {count, start: "-", end: "-"};
    }

    const sorted = anomalyProduction
      .slice()
      .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date));

    return {
      count,
      start: sorted[0].reported_period_date.slice(0, 7),
      end: sorted[sorted.length - 1].reported_period_date.slice(0, 7),
    };
  }, [anomalyProduction]);

  const anomalySummary = useMemo<DatasetSummary & {trueCount: number}>(() => {
    const count = anomalyPeriods?.length ?? 0;
    if (!anomalyPeriods || count === 0) {
      return {count, trueCount: 0, start: "-", end: "-"};
    }

    const sorted = anomalyPeriods
      .slice()
      .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date));

    const trueCount = sorted.filter((period) => period.anomaly?.is_anomaly === true).length;

    return {
      count,
      trueCount,
      start: sorted[0].reported_period_date.slice(0, 7),
      end: sorted[sorted.length - 1].reported_period_date.slice(0, 7),
    };
  }, [anomalyPeriods]);

  const onSelectResource = (_filterName: string, value: string) => {
    setSelectedResource(value as ProductionResource);
  };

  const updateChartDateRange = (filterName: string, value: unknown) => {
    const selectedValue = String(value ?? "");

    setChartDateInputs((previousValues) => {
      if (filterName === "startYear" && !selectedValue) {
        return {
          ...previousValues,
          startYear: "",
          startMonth: "",
        };
      }

      if (filterName === "endYear" && !selectedValue) {
        return {
          ...previousValues,
          endYear: "",
          endMonth: "",
        };
      }

      return {
        ...previousValues,
        [filterName]: selectedValue,
      };
    });
  };

  const selectedResourceLabel = PRODUCTION_TYPES[selectedResource].label;
  const selectedColor = PRODUCTION_TYPES[selectedResource].defaultColor;
  const unitLabel = selectedResource === "gas" ? UNITS.mm3 : unit;
  const requestedRange = useMemo<RangeWindow | null>(() => {
    const hasStart = Boolean(validatedDateRange.startYear && validatedDateRange.startMonth);
    const hasEnd = Boolean(validatedDateRange.endYear && validatedDateRange.endMonth);

    if (!hasStart || !hasEnd) return null;

    return {
      start: formatYearMonth(validatedDateRange.startYear, validatedDateRange.startMonth),
      end: formatYearMonth(validatedDateRange.endYear, validatedDateRange.endMonth),
    };
  }, [validatedDateRange]);

  const xAxisDomain = useMemo<[number | "dataMin", number | "dataMax"]>(() => {
    if (!requestedRange) {
      return ["dataMin", "dataMax"];
    }

    return [
      toMonthTimestamp(validatedDateRange.startYear, validatedDateRange.startMonth),
      toMonthTimestamp(validatedDateRange.endYear, validatedDateRange.endMonth),
    ];
  }, [requestedRange, validatedDateRange]);

  const yAxisTickFormatter = (value: number) => {
    if (selectedResource === "gas") return value.toFixed(2);
    return unit === UNITS.bbl ? value.toFixed(0) : value.toFixed(1);
  };

  const tooltipFormatter = (value?: number) => [
    `${Number(value ?? 0).toFixed(2)} ${unitLabel}`,
    `${selectedResourceLabel}`,
  ];

  const xAxisTickFormatter = (value: number) => {
    const date = new Date(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const tooltipLabelFormatter = (label: unknown) => {
    if (typeof label !== "number") return String(label ?? "");
    const date = new Date(label);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const anomalyCountLabel = `${anomalySummary.trueCount} ${anomalySummary.trueCount === 1 ? "anomalia" : "anomalias"}`;
  const rangeLabel = requestedRange
    ? `${requestedRange.start} - ${requestedRange.end}`
    : `${productionSummary.start} - ${productionSummary.end}`;

  return (
    <div style={styles.panel}>
      <div style={styles.headerRow}>
        <div style={styles.headerCopy}>
          <span style={styles.eyebrow}>Mapa analitico</span>
          <h3 style={styles.title}>Anomalias de produccion del pozo seleccionado</h3>
          <p style={styles.subtitle}>Explora meses atipicos sin salir de la vista del pozo.</p>
        </div>

        <div style={styles.metricCluster}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Serie</span>
            <strong style={styles.metricValue}>{productionSummary.count}</strong>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Alertas</span>
            <strong style={{...styles.metricValue, color: "#FF8A6C"}}>{anomalyCountLabel}</strong>
          </div>

          <div style={styles.metricCardWide}>
            <span style={styles.metricLabel}>Ventana visible</span>
            <strong style={styles.metricValue}>{rangeLabel}</strong>
          </div>
        </div>
      </div>

      {!selectedWellId && <InlineMessage message="Selecciona un pozo para visualizar anomalias." />}

      {selectedWellId && (
        <>
          <div style={styles.dateFiltersContainer}>
            <SelectFilter
              value={chartDateInputs.startYear}
              onSelect={updateChartDateRange}
              filterName="startYear"
              inputLabel="Ano inicio"
              options={YEARS}
              hasError={isStartRangeIncomplete}
            />

            <SelectFilter
              value={chartDateInputs.startMonth}
              onSelect={updateChartDateRange}
              filterName="startMonth"
              disabled={!chartDateInputs.startYear}
              defaultOptionLabel="Todos"
              inputLabel="Mes inicio"
              options={MONTHS}
              hasError={isStartRangeIncomplete}
            />

            <SelectFilter
              value={chartDateInputs.endYear}
              onSelect={updateChartDateRange}
              filterName="endYear"
              inputLabel="Ano fin"
              options={YEARS}
              hasError={isEndRangeIncomplete}
            />

            <SelectFilter
              value={chartDateInputs.endMonth}
              onSelect={updateChartDateRange}
              filterName="endMonth"
              disabled={!chartDateInputs.endYear}
              defaultOptionLabel="Todos"
              inputLabel="Mes fin"
              options={MONTHS}
              hasError={isEndRangeIncomplete}
            />
          </div>

          {(isStartRangeIncomplete || isEndRangeIncomplete) && (
            <InlineMessage
              variant="warning"
              message={[
                isStartRangeIncomplete ? "Fecha de inicio incompleta (falta ano o mes)." : "",
                isEndRangeIncomplete ? "Fecha de fin incompleta (falta ano o mes)." : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          )}

          <div style={styles.filtersRow}>
            <SelectFilter
              value={selectedResource}
              onSelect={onSelectResource}
              filterName="resource"
              inputLabel="Recurso"
              options={resourceOptions}
            />

            {selectedResource !== "gas" && (
              <div role="tablist" style={styles.unitSwitchContainer}>
                <button style={styles.unitButton(unit === UNITS.m3)} onClick={() => setUnit(UNITS.m3)}>
                  {UNITS.m3}
                </button>
                <button style={styles.unitButton(unit === UNITS.bbl)} onClick={() => setUnit(UNITS.bbl)}>
                  {UNITS.bbl}
                </button>
              </div>
            )}
          </div>

          <div style={styles.chartArea}>
            {loading && (
              <div style={styles.loadingContainer}>
                <LoadingState />
              </div>
            )}

            {error && <InlineMessage variant="error" message={error} />}

            {!loading && !error && chartData.length === 0 && (
              <InlineMessage message="No hay datos de produccion/anomalias para este rango." />
            )}

            {!loading && !error && chartData.length > 0 && (
              <div style={styles.chartWrapper}>
                <div style={styles.chartLegendRow}>
                  <div style={styles.legendGroup}>
                    <span style={styles.legendSwatch(selectedColor)} />
                    <span style={styles.legendText}>{selectedResourceLabel} ({unitLabel})</span>
                  </div>

                  <div style={styles.legendGroup}>
                    <span style={styles.alertDot} />
                    <span style={styles.legendText}>Mes anomalo</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{top: 18, right: 24, left: 4, bottom: 28}}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.14)" vertical={false} />
                    <XAxis
                      dataKey="dateTs"
                      type="number"
                      scale="time"
                      domain={xAxisDomain}
                      allowDataOverflow
                      tickFormatter={xAxisTickFormatter}
                      tick={{fontSize: 11, fill: "#C8D2C8"}}
                      axisLine={{stroke: "rgba(255,255,255,0.18)"}}
                      tickLine={{stroke: "rgba(255,255,255,0.18)"}}
                      angle={-45}
                      textAnchor="end"
                      height={52}
                    />
                    <YAxis
                      tickFormatter={yAxisTickFormatter}
                      tick={{fontSize: 11, fill: "#C8D2C8"}}
                      axisLine={{stroke: "rgba(255,255,255,0.18)"}}
                      tickLine={{stroke: "rgba(255,255,255,0.18)"}}
                    />
                    <Tooltip
                      formatter={tooltipFormatter}
                      labelFormatter={tooltipLabelFormatter}
                      cursor={{stroke: "rgba(255,255,255,0.18)", strokeDasharray: "4 4"}}
                      contentStyle={styles.tooltipContent}
                      labelStyle={styles.tooltipLabel}
                      itemStyle={styles.tooltipItem}
                    />

                    <Line
                      type="linear"
                      dataKey="resourceProduction"
                      name={`${selectedResourceLabel} (${unitLabel})`}
                      stroke={selectedColor}
                      strokeWidth={2.4}
                      dot={{r: 2.5, fill: selectedColor, stroke: "#0D1510", strokeWidth: 1}}
                      activeDot={{r: 4, fill: selectedColor, stroke: "#F5F1E8", strokeWidth: 1.5}}
                    />

                    <Scatter
                      name="Anomalia"
                      dataKey="anomalyMarker"
                      fill="#FF6B57"
                      stroke="#FFE1D9"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  panel: {
    marginTop: 24,
    border: "1px solid rgba(95, 135, 106, 0.45)",
    borderRadius: 20,
    padding: 20,
    background: "radial-gradient(circle at top left, rgba(78, 107, 88, 0.2), transparent 34%), linear-gradient(180deg, #181B18 0%, #111412 100%)",
    boxShadow: "0 22px 46px rgba(0, 0, 0, 0.28)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  } as React.CSSProperties,
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  } as React.CSSProperties,
  headerCopy: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  } as React.CSSProperties,
  eyebrow: {
    display: "inline-flex",
    width: "fit-content",
    padding: "4px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(119, 154, 126, 0.14)",
    border: "1px solid rgba(144, 188, 154, 0.24)",
    color: "#A7C4AB",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  } as React.CSSProperties,
  title: {
    margin: 0,
    fontSize: 22,
    lineHeight: 1.1,
    fontWeight: 700,
    color: "#F5F1E8",
  } as React.CSSProperties,
  subtitle: {
    margin: 0,
    fontSize: 13,
    color: "#A5B3A7",
  } as React.CSSProperties,
  metricCluster: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  } as React.CSSProperties,
  metricCard: {
    minWidth: 110,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  } as React.CSSProperties,
  metricCardWide: {
    minWidth: 170,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  } as React.CSSProperties,
  metricLabel: {
    fontSize: 11,
    color: "#94A59A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as React.CSSProperties,
  metricValue: {
    fontSize: 15,
    fontWeight: 700,
    color: "#F5F1E8",
  } as React.CSSProperties,
  dateFiltersContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  filtersRow: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  } as React.CSSProperties,
  chartArea: {
    minHeight: 360,
    width: "100%",
    overflow: "hidden",
  } as React.CSSProperties,
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 320,
  } as React.CSSProperties,
  chartWrapper: {
    height: 360,
    padding: 16,
    borderRadius: 20,
    background: "radial-gradient(circle at top, rgba(76, 96, 83, 0.18), transparent 36%), linear-gradient(180deg, #111714 0%, #0D100F 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  } as React.CSSProperties,
  chartLegendRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 8,
  } as React.CSSProperties,
  legendGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  legendSwatch: (color: string): React.CSSProperties => ({
    width: 26,
    height: 8,
    borderRadius: 999,
    backgroundColor: color,
    boxShadow: `0 0 12px ${color}55`,
  }),
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#FF6B57",
    boxShadow: "0 0 16px rgba(255, 107, 87, 0.55)",
  } as React.CSSProperties,
  legendText: {
    fontSize: 12,
    color: "#CFD7CF",
  } as React.CSSProperties,
  unitSwitchContainer: {
    display: "flex",
    gap: 6,
    padding: "4px",
    width: "fit-content",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  } as React.CSSProperties,
  unitButton: (isActive: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    borderRadius: 8,
    border: `1px solid ${isActive ? "rgba(167, 196, 171, 0.38)" : "transparent"}`,
    backgroundColor: isActive ? "rgba(104, 146, 115, 0.18)" : "transparent",
    color: isActive ? "#E7F2E8" : "#C4CDC5",
    fontSize: 13,
    fontWeight: isActive ? 600 : 500,
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  }),
  tooltipContent: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12, 15, 13, 0.94)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
  } as React.CSSProperties,
  tooltipLabel: {
    color: "#F5F1E8",
    fontWeight: 700,
  } as React.CSSProperties,
  tooltipItem: {
    color: "#DDE6DE",
  } as React.CSSProperties,
} as const;
