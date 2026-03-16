import React, {useMemo, useState} from "react";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {useUnit} from "@/hooks/useUnit";
import {useWellAnomalies} from "@/hooks/useWellAnomalies";
import {ProductionResource} from "@/components/map/anomalies/types";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {WellAnomaliesChart} from "@/components/map/anomalies/WellAnomaliesChart";
import {DateRangeFilters} from "@/components/map/DateRangeFilters";
import {ResourceSelector} from "@/components/map/anomalies/ResourceSelector";
import {buildAnomalyChartData, getAnomalyDateSet} from "@/components/map/anomalies/data";
import {
  applyDateRangeInputChange,
  DateRangeValue,
  getDateRangeCompleteness,
  getValidatedDateRange,
} from "@/utils/dateRange";

interface WellAnomaliesPanelProps {
  selectedWellId: string | null;
}

type ValidatedAnomalyDateRange = DateRangeValue;

interface RangeWindow {
  start: string;
  end: string;
}

const EMPTY_DATE_RANGE: ValidatedAnomalyDateRange = {
  startYear: "2023",
  startMonth: "1",
  endYear: "2025",
  endMonth: "6",
};

const formatYearMonth = (year: string, month: string) => `${year}-${month.padStart(2, "0")}`;

const toMonthTimestamp = (year: string, month: string) => new Date(Number(year), Number(month) - 1, 1).getTime();

export function WellAnomaliesPanel({
  selectedWellId,
}: WellAnomaliesPanelProps) {
  const [selectedResource, setSelectedResource] = useState<ProductionResource>("oil");
  const [chartDateInputs, setChartDateInputs] = useState<ValidatedAnomalyDateRange>(EMPTY_DATE_RANGE);
  const {unit, setUnit} = useUnit();
  const validatedDateRange = useMemo(() => getValidatedDateRange(chartDateInputs), [chartDateInputs]);
  const {isStartRangeIncomplete, isEndRangeIncomplete} = useMemo(
    () => getDateRangeCompleteness(chartDateInputs),
    [chartDateInputs]
  );

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

  const anomalyDateSet = useMemo(() => getAnomalyDateSet(anomalyPeriods), [anomalyPeriods]);

  const chartData = useMemo(() => {
    return buildAnomalyChartData(anomalyProduction, selectedResource, unit, anomalyDateSet);
  }, [anomalyProduction, selectedResource, unit, anomalyDateSet]);

  const anomalyCount = useMemo(() => {
    if (!anomalyPeriods || anomalyPeriods.length === 0) return 0;
    return anomalyPeriods.filter((period) => period.anomaly?.is_anomaly === true).length;
  }, [anomalyPeriods]);

  const updateChartDateRange = (filterName: string, value: unknown) => {
    setChartDateInputs((previousValues) =>
      applyDateRangeInputChange(previousValues, filterName, value)
    );
  };

  const selectedResourceLabel = PRODUCTION_TYPES[selectedResource].label;
  const selectedColor = PRODUCTION_TYPES[selectedResource].defaultColor;
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

  const rangeLabel = requestedRange
    ? `${requestedRange.start} - ${requestedRange.end}`
    : "Rango completo";

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>Anomalias de produccion del pozo seleccionado</h3>

      {!selectedWellId && <InlineMessage message="Selecciona un pozo para visualizar anomalias." />}

      {selectedWellId && (
        <>
          <div style={styles.dateFiltersContainer}>
            <DateRangeFilters
              value={chartDateInputs}
              onChange={updateChartDateRange}
              isStartRangeIncomplete={isStartRangeIncomplete}
              isEndRangeIncomplete={isEndRangeIncomplete}
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
            <ResourceSelector
              selectedResource={selectedResource}
              onResourceChange={setSelectedResource}
              unit={unit}
              onUnitChange={setUnit}
            />
          </div>

          <div style={styles.metaRow}>
            <span style={styles.metaChip}>Serie: {chartData.length}</span>
            <span style={styles.metaChip}>Ventana: {rangeLabel}</span>
            <span style={styles.metaChipAlert}>Anomalias detectadas: {anomalyCount}</span>
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
              <WellAnomaliesChart
                data={chartData}
                xAxisDomain={xAxisDomain}
                selectedResource={selectedResource}
                selectedResourceLabel={selectedResourceLabel}
                selectedColor={selectedColor}
                unit={unit}
              />
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
    border: `1px solid ${colors.panelBorder}`,
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
  filtersRow: {
    display: "block",
  } as React.CSSProperties,
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
} as const;
