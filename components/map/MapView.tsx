"use client";

import React, {useEffect, useMemo, useState} from "react";
import {toNumber} from "@/utils/helpers";
import {TimeSeriesChart} from "@/components/map/TimeSeriesChart";
import {WellInfo} from "@/components/map/WellInfo";
import {WellsMap} from "@/components/map/WellsMap";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {useWellsHeatmap} from "@/hooks/useWellsHeatmap";
import type {HeatmapResource} from "@/hooks/useWellsHeatmap";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
import {WellFilters} from "@/app/types/wellFilters";
import {colors} from "@/utils/constants";

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

  const {data: selectedWellDetails, loading: loadingWell, error: errorGettingWellDetails} =
      useWell({wellId: selectedWellId});

  const {data: wellProduction, loading: loadingWellProduction, error: errorGettingWellProduction} =
      useWellsProduction({wellId: selectedWellId});

  const errorMessage =
      errorGettingWells ||
      errorGettingWellDetails ||
      errorGettingWellProduction ||
      null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

  const timeSeriesChartData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) return null;

    return wellProduction
        .slice()
        .sort((a, b) =>
            a.reported_period_date.localeCompare(b.reported_period_date)
        )
        .map((record) => ({
          date: record.reported_period_date.slice(0, 7),
          oil: toNumber(record.oil_production) ?? 0,
          gas: toNumber(record.gas_production) ?? 0,
          water: toNumber(record.water_production) ?? 0,
        }));
  }, [wellProduction]);

  const {geojsonData: heatmapData, maxValue: heatmapMaxValue} = useWellsHeatmap({
    resource: heatmapResource,
  });

  const RESOURCE_LABELS: Record<HeatmapResource, string> = {
    oil: "Petróleo",
    gas: "Gas",
    water: "Agua",
  };

  return (
      <>
        {mode === "heatmap" && (
          <div style={styles.toggleBar}>
            <div style={styles.toggleLabel}>Recurso:</div>
            <div style={styles.resourceButtons}>
              {(["oil", "gas", "water"] as HeatmapResource[]).map((resource) => (
                <button
                  key={resource}
                  style={styles.resourceBtn(heatmapResource === resource, resource)}
                  onClick={() => onSelectHeatmapResource(resource)}
                >
                  {RESOURCE_LABELS[resource]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={styles.wellDetailsContainer}>
          <WellsMap
              wells={wells || []}
              selectedWellId={selectedWellId}
              onSelectWell={setSelectedWellId}
              mapMode={mode === "pozos" ? "markers" : "heatmap"}
              heatmapData={heatmapData}
              heatmapMaxValue={heatmapMaxValue}
          />

          <WellInfo
              wellInfo={selectedWellDetails}
              loadingWell={loadingWell}
          />
        </div>

        {loadingWellProduction && selectedWellId && (
            <div style={styles.loadingContainer}>
              <LoadingState/>
            </div>
        )}

        {wellProduction && (
            <TimeSeriesChart data={timeSeriesChartData}/>
        )}

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


const RESOURCE_COLORS: Record<string, string> = {
    oil: colors.oil,
    gas: colors.gas,
    water: colors.water,
};

const styles = {
    toggleBar: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        backgroundColor: "rgba(255,255,255,0.95)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
        marginBottom: 12,
    } as React.CSSProperties,
    toggleLabel: {
        fontWeight: 600,
        color: colors.text,
        marginRight: 10,
        minWidth: 72,
    } as React.CSSProperties,
    toggleBtn: (active: boolean) => ({
        padding: "8px 18px",
        borderRadius: 999,
        border: `1px solid ${active ? colors.accent : colors.panelBorder}`,
        backgroundColor: active ? colors.accent : "transparent",
        color: active ? "#fff" : colors.text,
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 13,
        transition: "all 0.18s ease",
        boxShadow: active ? "0 6px 12px rgba(0,0,0,0.12)" : "none",
    }) as React.CSSProperties,
    resourceButtons: {
        display: "flex",
        gap: 6,
        marginLeft: "auto",
    } as React.CSSProperties,
    resourceBtn: (active: boolean, resource: string) => ({
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${RESOURCE_COLORS[resource] || colors.accent}`,
        backgroundColor: active ? (RESOURCE_COLORS[resource] || colors.accent) : "transparent",
        color: active ? "#fff" : colors.text,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        fontSize: 12,
        transition: "all 0.18s ease",
    }) as React.CSSProperties,
    errorMessageContainer: {
        display: "flex"
    } as React.CSSProperties,
    loadingContainer: {
        display: "flex"
    } as React.CSSProperties,
    wellDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        height: 560
    } as React.CSSProperties,
} as const;
