"use client";

import React, {useEffect, useState} from "react";
import {WellInfo} from "@/components/map/WellInfo";
import {WellsMap} from "@/components/map/WellsMap";
import {EMPTY_VALIDATED_RANGE, ProductionPanel, ValidatedProductionDateRange} from "@/components/map/ProductionPanel";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
import {WellFilters} from "@/app/types/wellFilters";
import {WellAnomaliesPanel} from "@/components/map/anomalies/WellAnomaliesPanel";

type MapViewProps = {
  filters: WellFilters;
};

export function MapView({filters}: MapViewProps) {
  const {data: wells, loading: loadingWells, error: errorGettingWells} = useWells({filters});
  const [selectedWellId, setSelectedWellId] = useState<string | null>(null);
  const [validatedDateRange, setValidatedDateRange] = useState<ValidatedProductionDateRange>(EMPTY_VALIDATED_RANGE);

  const handleSelectWell = (wellId: string) => {
    setSelectedWellId(wellId);
    setValidatedDateRange(EMPTY_VALIDATED_RANGE);
  };

  const {data: selectedWellDetails, loading: loadingWell, error: errorGettingWellDetails} =
    useWell({wellId: selectedWellId});

  const {data: wellProduction, loading: loadingWellProduction, error: errorGettingWellProduction} =
    useWellsProduction({wellId: selectedWellId, dateRange: validatedDateRange});

  const errorMessage =
    errorGettingWells ||
    errorGettingWellDetails ||
    null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

  return (
    <>
      <div style={styles.wellDetailsContainer}>
        <WellsMap
          wells={wells || []}
          selectedWellId={selectedWellId}
          onSelectWell={handleSelectWell}
        />

        <WellInfo
          wellInfo={selectedWellDetails}
          loadingWell={loadingWell}
        />
      </div>

      <ProductionPanel
        key={selectedWellId ?? "none"}
        selectedWellId={selectedWellId}
        wellProduction={wellProduction}
        loadingWellProduction={loadingWellProduction}
        errorWellProduction={errorGettingWellProduction}
        onValidatedRangeChange={setValidatedDateRange}
      />

      <WellAnomaliesPanel
        selectedWellId={selectedWellId}
      />

      {errorMessage && (
        <div style={styles.errorMessageContainer}>
          <InlineMessage
            message={errorMessage || "Unexpected error"}
            variant="error"
          />
        </div>
      )}

      {loadingWells && (
        <div style={styles.loadingContainer}>
          <LoadingState/>
        </div>
      )}
    </>
  );
}

const styles = {
  errorMessageContainer: {
    display: "flex"
  } as React.CSSProperties,
  loadingContainer: {
    display: "flex"
  } as React.CSSProperties,
  wellDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 16,
    minHeight: 560,
  } as React.CSSProperties,
} as const;
