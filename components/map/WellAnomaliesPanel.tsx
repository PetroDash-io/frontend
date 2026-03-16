import React, {useMemo, useState} from "react";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {convertValueToUnit, UNITS} from "@/utils/units";
import {useUnit} from "@/hooks/useUnit";
import {useWellAnomalies} from "@/hooks/useWellAnomalies";
import {ProductionMonthly} from "@/app/types";
import {ProductionResource} from "@/app/types/anomalies";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {AnomalyChartPoint, WellAnomaliesChart} from "@/components/map/WellAnomaliesChart";
import {DateRangeFilters} from "@/components/map/DateRangeFilters";
import {DateRangeValue, getValidatedDateRange} from "@/utils/dateRange";

interface WellAnomaliesPanelProps {
  selectedWellId: string | null;
}

type ValidatedAnomalyDateRange = DateRangeValue;

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

const formatYearMonth = (year: string, month: string) => `${year}-${month.padStart(2, "0")}`;

const toMonthTimestamp = (year: string, month: string) => new Date(Number(year), Number(month) - 1, 1).getTime();

export function WellAnomaliesPanel({
  selectedWellId,
}: WellAnomaliesPanelProps) {
  const [selectedResource, setSelectedResource] = useState<ProductionResource>("oil");
  const [chartDateInputs, setChartDateInputs] = useState<ValidatedAnomalyDateRange>(EMPTY_DATE_RANGE);
  const {unit, setUnit} = useUnit();
  const validatedDateRange = useMemo(() => getValidatedDateRange(chartDateInputs), [chartDateInputs]);

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

  const chartData = useMemo<AnomalyChartPoint[]>(() => {
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

  const anomalyCount = useMemo(() => {
    if (!anomalyPeriods || anomalyPeriods.length === 0) return 0;
    return anomalyPeriods.filter((period) => period.anomaly?.is_anomaly === true).length;
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
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
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
