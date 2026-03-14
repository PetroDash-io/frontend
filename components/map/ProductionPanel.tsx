import React, {useEffect, useMemo, useRef, useState} from "react";
import {MONTHS, YEARS} from "@/utils/constants";
import {toNumber} from "@/utils/helpers";
import {ProductionMonthly} from "@/app/types";
import {SelectFilter} from "@/components/common/SelectFilter";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {TimeSeriesChart} from "@/components/map/TimeSeriesChart";

export interface ValidatedProductionDateRange {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}

interface ProductionPanelProps {
  selectedWellId: string | null;
  wellProduction: ProductionMonthly[] | null;
  loadingWellProduction: boolean;
  errorWellProduction: string | null;
  onValidatedRangeChange: (range: ValidatedProductionDateRange) => void;
}

export const EMPTY_VALIDATED_RANGE: ValidatedProductionDateRange = {
  startYear: "",
  startMonth: "",
  endYear: "",
  endMonth: "",
};

const getValidatedRange = (inputs: ValidatedProductionDateRange): ValidatedProductionDateRange => {
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

export function ProductionPanel({
  selectedWellId,
  wellProduction,
  loadingWellProduction,
  errorWellProduction,
  onValidatedRangeChange,
}: ProductionPanelProps) {
  const [chartDateInputs, setChartDateInputs] = useState<ValidatedProductionDateRange>(EMPTY_VALIDATED_RANGE);
  const lastEmittedRangeRef = useRef<ValidatedProductionDateRange | null>(null);

  const hasStartYear = Boolean(chartDateInputs.startYear);
  const hasStartMonth = Boolean(chartDateInputs.startMonth);
  const hasEndYear = Boolean(chartDateInputs.endYear);
  const hasEndMonth = Boolean(chartDateInputs.endMonth);

  const isStartRangeIncomplete = hasStartYear !== hasStartMonth;
  const isEndRangeIncomplete = hasEndYear !== hasEndMonth;

  const validatedDateRange = useMemo(() => getValidatedRange(chartDateInputs), [chartDateInputs]);

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
    const selectedValue = String(value ?? "");

    setChartDateInputs((previousValues) => {
      let nextValues: ValidatedProductionDateRange;

      if (filterName === "startYear" && !selectedValue) {
        nextValues = {
          ...previousValues,
          startYear: "",
          startMonth: "",
        };
      } else if (filterName === "endYear" && !selectedValue) {
        nextValues = {
          ...previousValues,
          endYear: "",
          endMonth: "",
        };
      } else {
        nextValues = {
          ...previousValues,
          [filterName]: selectedValue,
        };
      }

      return nextValues;
    });
  };

  return (
    <div style={styles.productionPanel}>
      <h3 style={styles.productionPanelTitle}>Produccion mensual del pozo seleccionado</h3>

      {!selectedWellId && <InlineMessage message="Selecciona un pozo en el mapa para ver su serie de produccion." />}

      {selectedWellId && (
        <>
          <div style={styles.chartFiltersContainer}>
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
                isStartRangeIncomplete ? "Fecha de inicio incompleta (falta año o mes)." : "",
                isEndRangeIncomplete ? "Fecha de fin incompleta (falta año o mes)." : "",
              ]
                .filter(Boolean)
                .join(" ")}
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
