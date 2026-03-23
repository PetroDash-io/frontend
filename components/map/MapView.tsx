"use client";

import React, {useEffect, useState} from "react";
import {WellInfo} from "@/components/map/WellInfo";
import {WellsMap} from "@/components/map/WellsMap";
import {EMPTY_VALIDATED_RANGE, ProductionPanel, ValidatedProductionDateRange} from "@/components/map/ProductionPanel";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useWellsProduction} from "@/hooks/useWellProduction";
import type {HeatmapResource} from "@/hooks/useWellsHeatmap";
import {useMapHeatmap} from "@/hooks/useMapHeatmap";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
import {WellFilters} from "@/app/types/wellFilters";
import {WellAnomaliesPanel} from "@/components/map/anomalies/WellAnomaliesPanel";
import {MapHeatmapControls} from "@/components/map/MapHeatmapControls";

export type MapViewMode = "pozos" | "heatmap";

export type MapViewProps = {
  filters: WellFilters;
  mode: MapViewMode;
  heatmapResource: HeatmapResource;
  onSelectHeatmapResource: (resource: HeatmapResource) => void;
};

export function MapView({filters, mode, heatmapResource, onSelectHeatmapResource}: MapViewProps) {
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

  const {isHeatmapMode, mapMode, heatmapData, heatmapMaxValue} = useMapHeatmap({
    mode,
    resource: heatmapResource,
    watershed: filters.watershed,
    limit: filters.limit,
  });

  return (
      <>
        {isHeatmapMode && (
          <MapHeatmapControls
            selectedResource={heatmapResource}
            onSelectResource={onSelectHeatmapResource}
          />
        )}

        <div style={styles.wellDetailsContainer}>
          <WellsMap
              wells={wells || []}
              selectedWellId={selectedWellId}
              onSelectWell={handleSelectWell}
                mapMode={mapMode}
              heatmapData={heatmapData}
              heatmapMaxValue={heatmapMaxValue}
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
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 420px)",
        alignItems: "stretch",
        gap: 16,
        minHeight: 560,
        height: "min(70vh, 700px)",
    } as React.CSSProperties,
} as const;