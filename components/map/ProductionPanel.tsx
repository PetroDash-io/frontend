import React, {useEffect, useMemo, useRef, useState} from "react";
import {toNumber} from "@/utils/helpers";
import {ProductionMonthly} from "@/app/types";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {TimeSeriesChart} from "@/components/map/TimeSeriesChart";
import {DateRangeFilters} from "@/components/map/DateRangeFilters";
import {
  applyDateRangeInputChange,
  DateRangeValue,
  EMPTY_DATE_RANGE,
  getDateRangeCompleteness,
  getDateRangeWarningMessage,
  getValidatedDateRange,
} from "@/utils/dateRange";

export type ValidatedProductionDateRange = DateRangeValue;

interface ProductionPanelProps {
  selectedWellId: string | null;
  wellProduction: ProductionMonthly[] | null;
  loadingWellProduction: boolean;
  errorWellProduction: string | null;
  onValidatedRangeChange: (range: ValidatedProductionDateRange) => void;
}

export const EMPTY_VALIDATED_RANGE: ValidatedProductionDateRange = EMPTY_DATE_RANGE;

export function ProductionPanel({
  selectedWellId,
  wellProduction,
  loadingWellProduction,
  errorWellProduction,
  onValidatedRangeChange,
}: ProductionPanelProps) {
  const [chartDateInputs, setChartDateInputs] = useState<ValidatedProductionDateRange>(EMPTY_VALIDATED_RANGE);
  const lastEmittedRangeRef = useRef<ValidatedProductionDateRange | null>(null);

  const {isStartRangeIncomplete, isEndRangeIncomplete} = useMemo(
    () => getDateRangeCompleteness(chartDateInputs),
    [chartDateInputs]
  );

  const validatedDateRange = useMemo(() => getValidatedDateRange(chartDateInputs), [chartDateInputs]);

  useEffect(() => {
    const previousRange = lastEmittedRangeRef.current;
    const hasChanged =
      !previousRange ||
      previousRange.startYear !== validatedDateRange.startYear ||
      previousRange.startMonth !== validatedDateRange.startMonth ||
      previousRange.endYear !== validatedDateRange.endYear ||
      previousRange.endMonth !== validatedDateRange.endMonth;

    if (!hasChanged) return;

    lastEmittedRangeRef.current = validatedDateRange;
    onValidatedRangeChange(validatedDateRange);
  }, [validatedDateRange, onValidatedRangeChange]);

  const hasValidatedRange = Boolean(
    validatedDateRange.startYear ||
      validatedDateRange.startMonth ||
      validatedDateRange.endYear ||
      validatedDateRange.endMonth
  );

  const hasNoProductionForWell =
    Boolean(selectedWellId) &&
    !loadingWellProduction &&
    !errorWellProduction &&
    !hasValidatedRange &&
    Array.isArray(wellProduction) &&
    wellProduction.length === 0;

  const timeSeriesChartData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) return null;

    return wellProduction
      .slice()
      .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date))
      .map((record) => ({
        date: record.reported_period_date.slice(0, 7),
        oil: toNumber(record.oil_production) ?? 0,
        gas: toNumber(record.gas_production) ?? 0,
        water: toNumber(record.water_production) ?? 0,
      }));
  }, [wellProduction]);

  const updateChartDateRange = (filterName: string, value: unknown) => {
    setChartDateInputs((previousValues) =>
      applyDateRangeInputChange(previousValues, filterName, value)
    );
  };

  return (
    <div style={styles.productionPanel}>
      <h3 style={styles.productionPanelTitle}>Produccion mensual del pozo seleccionado</h3>

      {!selectedWellId && <InlineMessage message="Selecciona un pozo en el mapa para ver su serie de produccion." />}

      {selectedWellId && (
        <>
          <div style={styles.chartFiltersContainer}>
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
              message={getDateRangeWarningMessage(isStartRangeIncomplete, isEndRangeIncomplete)}
            />
          )}

          <div style={styles.chartContentArea}>
            {loadingWellProduction && (
              <div style={styles.chartLoadingContainer}>
                <LoadingState />
              </div>
            )}

            {errorWellProduction && (
              <InlineMessage variant="error" message={errorWellProduction} />
            )}

            {hasNoProductionForWell && (
              <InlineMessage message="Este pozo no tiene produccion mensual registrada." />
            )}

            {!loadingWellProduction && !errorWellProduction && !hasNoProductionForWell && wellProduction && (
              <TimeSeriesChart data={timeSeriesChartData} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  productionPanel: {
    marginTop: 24,
    border: "1px solid #3F6B4F",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#FAFAF9",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  } as React.CSSProperties,
  productionPanelTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  } as React.CSSProperties,
  chartFiltersContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  chartContentArea: {
    minHeight: 360,
    width: "100%",
    overflow: "hidden",
  } as React.CSSProperties,
  chartLoadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 360,
  } as React.CSSProperties,
} as const;
