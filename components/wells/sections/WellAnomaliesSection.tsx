import React, {useState} from "react";
import {ProductionMonthly, ProductionResource} from "@/app/types";
import {DateRangeValue} from "@/utils/dateRange";
import {useWellAnomalies} from "@/hooks/useWellAnomalies";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {AnomaliesTimeSeries} from "@/components/wells/sections/AnomaliesTimeSeries";

const resourceOptions: SelectFilterOption[] = [
  {value: "oil", label: "Petroleo"},
  {value: "gas", label: "Gas"},
  {value: "water", label: "Agua"},
];

interface WellAnomaliesSectionProps {
  wellId: number;
  dateRange: DateRangeValue;
  production: ProductionMonthly[] | null;
  productionLoading: boolean;
  productionError: string | null;
}

export function WellAnomaliesSection({
  wellId,
  dateRange,
  production,
  productionLoading,
  productionError,
}: WellAnomaliesSectionProps) {
  const [selectedResource, setSelectedResource] = useState<ProductionResource>("oil");

  const {
    data: anomalyPeriods,
    loading: loadingAnomalies,
    error: errorAnomalies,
  } = useWellAnomalies({wellId, resource: selectedResource, dateRange});

  const updateSelectedResource = (_filterName: string, value: string) => {
    if (value === "oil" || value === "gas" || value === "water") {
      setSelectedResource(value);
    }
  };

  return (
    <>
      <div style={styles.filterRow}>
        <SelectFilter
          value={selectedResource}
          onSelect={updateSelectedResource}
          filterName="selectedResource"
          inputLabel="Recurso"
          options={resourceOptions}
        />
      </div>

      {loadingAnomalies && <LoadingState />}
      {errorAnomalies && <InlineMessage message={errorAnomalies} variant="error" />}

      {!loadingAnomalies && !errorAnomalies && productionLoading && (
        <LoadingState />
      )}

      {!loadingAnomalies && !errorAnomalies && !productionLoading && productionError && (
        <InlineMessage
          message="No se pudo cargar la serie de producción para contextualizar anomalías."
          variant="error"
        />
      )}

      {!loadingAnomalies && !errorAnomalies && !productionLoading && !productionError && anomalyPeriods.length === 0 && (
        <InlineMessage message="No hay anomalías para este pozo y recurso en el período seleccionado." />
      )}

      {!loadingAnomalies &&
        !errorAnomalies &&
        !productionLoading &&
        !productionError &&
        anomalyPeriods.length > 0 && (
          <AnomaliesTimeSeries
            production={production}
            anomalyPeriods={anomalyPeriods}
            resource={selectedResource}
          />
        )}
    </>
  );
}

const styles = {
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  } as React.CSSProperties,
};
