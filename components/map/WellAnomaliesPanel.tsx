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
  resourceProduction: number;
  anomalyMarker: number | null;
}

interface DatasetSummary {
  count: number;
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

  const yAxisTickFormatter = (value: number) => {
    if (selectedResource === "gas") return value.toFixed(2);
    return unit === UNITS.bbl ? value.toFixed(0) : value.toFixed(1);
  };

  const tooltipFormatter = (value?: number) => [
    `${Number(value ?? 0).toFixed(2)} ${unitLabel}`,
    `${selectedResourceLabel}`,
  ];

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>Anomalias de produccion del pozo seleccionado</h3>

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

          {!isStartRangeIncomplete && !isEndRangeIncomplete && (
            <p style={styles.debugText}>
              API produccion: {productionSummary.count} puntos ({productionSummary.start} a {productionSummary.end}) | API anomalias: {anomalySummary.count} filas ({anomalySummary.start} a {anomalySummary.end}), is_anomaly=true: {anomalySummary.trueCount}
            </p>
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{top: 10, right: 20, left: 0, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" minTickGap={18} />
                    <YAxis tickFormatter={yAxisTickFormatter} />
                    <Tooltip formatter={tooltipFormatter} />

                    <Line
                      type="linear"
                      dataKey="resourceProduction"
                      name={`${selectedResourceLabel} (${unitLabel})`}
                      stroke={selectedColor}
                      strokeWidth={2}
                      dot={{r: 3}}
                    />

                    <Scatter
                      name="Anomalia"
                      dataKey="anomalyMarker"
                      fill="#d62728"
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
    border: "1px solid #3F6B4F",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#FAFAF9",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  } as React.CSSProperties,
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  } as React.CSSProperties,
  dateFiltersContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  debugText: {
    margin: 0,
    fontSize: 12,
    color: "#9CA3AF",
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
    height: 320,
  } as React.CSSProperties,
  unitSwitchContainer: {
    display: "flex",
    gap: 6,
    padding: "4px",
    width: "fit-content",
    border: "1px solid #d8cdbf",
    borderRadius: 10,
    backgroundColor: "#faf8f3",
  } as React.CSSProperties,
  unitButton: (isActive: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    borderRadius: 8,
    border: `1px solid ${isActive ? "#c9d8ce" : "transparent"}`,
    backgroundColor: isActive ? "#e9f0eb" : "transparent",
    color: isActive ? "#2f3e34" : "#4b2a1a",
    fontSize: 13,
    fontWeight: isActive ? 600 : 500,
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  }),
} as const;
