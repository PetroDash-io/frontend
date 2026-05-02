import React, {useEffect, useMemo} from "react";
import {WellInfo} from "@/components/wells/common/WellInfo";
import {WellsMap} from "@/components/wells/map/WellsMap";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import type {HeatmapResource} from "@/hooks/useWellsHeatmap";
import {useMapHeatmap} from "@/hooks/useMapHeatmap";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
import {WellFilters} from "@/app/types/wellFilters";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {useMapMetrics} from "@/hooks/useMapMetrics";
import {formatCompactNumber} from "@/utils/helpers";

export type MapViewMode = "pozos" | "heatmap";

export type MapViewProps = {
  filters: WellFilters;
  mode: MapViewMode;
  onChangeMode: (mode: MapViewMode) => void;
  selectedWellId: number | null;
  onSelectWell: (wellId: number) => void;
  heatmapResource: HeatmapResource;
  onSelectHeatmapResource: (resource: HeatmapResource) => void;
};

export function MapView({
  filters,
  mode,
  onChangeMode,
  selectedWellId,
  onSelectWell,
  heatmapResource,
  onSelectHeatmapResource,
}: MapViewProps) {
  const {data: wells, loading: loadingWells, error: errorGettingWells} = useWells({filters});

  const {
    data: selectedWellDetails,
    loading: loadingWell,
    error: errorGettingWellDetails,
  } = useWell({wellId: selectedWellId});

  const errorMessage = errorGettingWells || errorGettingWellDetails || null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

  const {isHeatmapMode, mapMode, heatmapData, heatmapMaxValue} = useMapHeatmap({
    mode,
    resource: heatmapResource,
    filters,
  });

  const {
    data: mapMetrics,
    loading: loadingMetrics,
    error: errorGettingMetrics,
  } = useMapMetrics(filters, heatmapResource);

  const metricsItems = useMemo(() => {
    if (!mapMetrics) return [];

    const productionLabel = PRODUCTION_TYPES[mapMetrics.resource]?.label || "Petróleo";
    const lastMonthLabel = mapMetrics.last_month ? mapMetrics.last_month.slice(0, 7) : "Sin datos";

    return [
      {
        label: "Pozos activos",
        value: formatCompactNumber(mapMetrics.active_wells),
      },
      {
        label: `Producción total del último mes (${productionLabel})`,
        value: formatCompactNumber(mapMetrics.total_production_last_month),
        subLabel: mapMetrics.last_month ? `Mes registrado: ${lastMonthLabel}` : "Sin datos",
      },
      {
        label: "Pozos parados",
        value: formatCompactNumber(mapMetrics.stopped_wells),
      },
      {
        label: "Pozos inactivos",
        value: formatCompactNumber(mapMetrics.inactive_wells),
      },
      {
        label: "No informados",
        value: formatCompactNumber(mapMetrics.not_informed_wells),
      },
    ];
  }, [mapMetrics]);

  return (
    <>
      <div style={styles.wellDetailsContainer}>
        <WellsMap
          wells={wells || []}
          selectedWellId={selectedWellId}
          onSelectWell={onSelectWell}
          mapMode={mapMode}
          heatmapData={heatmapData}
          heatmapMaxValue={heatmapMaxValue}
          overlayControlsTopRight={
            isHeatmapMode ? (
              <div style={styles.heatmapControls}>
                <span style={styles.heatmapControlsLabel}>Recurso</span>
                <div style={styles.heatmapResourceButtons}>
                  <button
                    type="button"
                    onClick={() => onSelectHeatmapResource("oil")}
                    style={styles.heatmapResourceButton(heatmapResource === "oil")}
                  >
                    Petróleo
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectHeatmapResource("gas")}
                    style={styles.heatmapResourceButton(heatmapResource === "gas")}
                  >
                    Gas
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectHeatmapResource("water")}
                    style={styles.heatmapResourceButton(heatmapResource === "water")}
                  >
                    Agua
                  </button>
                </div>
              </div>
            ) : null
          }
          overlayControlsBottomCenter={
            <div style={styles.modeDock} role="group" aria-label="Visualización del mapa">
              <button
                type="button"
                style={styles.modeDockButton(mode === "pozos")}
                onClick={() => onChangeMode("pozos")}
              >
                <span style={styles.modeDot(mode === "pozos")}></span>
                Pozos
              </button>
              <button
                type="button"
                style={styles.modeDockButton(mode === "heatmap")}
                onClick={() => onChangeMode("heatmap")}
              >
                <span style={styles.modeGrid(mode === "heatmap")}>#</span>
                Heatmap
              </button>
            </div>
          }
        />
        <WellInfo
          wellInfo={selectedWellDetails}
          loadingWell={loadingWell}
          metricsItems={metricsItems}
          metricsLoading={loadingMetrics}
          metricsError={errorGettingMetrics}
          metricsHint={selectedWellId ? undefined : "Seleccioná un pozo para ver el detalle."}
        />
      </div>

      {errorMessage && (
        <div style={styles.errorMessageContainer}>
          <InlineMessage message={errorMessage || "Unexpected error"} variant="error" />
        </div>
      )}

      {loadingWells && (
        <div style={styles.loadingContainer}>
          <LoadingState />
        </div>
      )}
    </>
  );
}

const styles = {
  errorMessageContainer: {
    display: "flex",
  } as React.CSSProperties,
  loadingContainer: {
    display: "flex",
  } as React.CSSProperties,
  wellDetailsContainer: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 420px)",
    alignItems: "stretch",
    gap: 16,
    minHeight: 560,
    height: "min(70vh, 700px)",
  } as React.CSSProperties,
  modeDock: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px",
    borderRadius: 999,
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "rgba(255,255,255,0.94)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.16)",
  } as React.CSSProperties,
  modeDockButton: (active: boolean) => ({
    border: `1px solid ${active ? "var(--color-brand-mid)" : "transparent"}`,
    borderRadius: 999,
    backgroundColor: active ? "var(--color-brand-mid)" : "transparent",
    color: active ? "var(--color-text-inverse)" : "var(--color-text-primary)",
    fontSize: 12,
    fontWeight: 700,
    padding: "8px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    minWidth: 96,
    justifyContent: "center",
  }) as React.CSSProperties,
  modeDot: (active: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: active ? "var(--color-text-inverse)" : "var(--color-brand-mid)",
  }) as React.CSSProperties,
  modeGrid: (active: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 10,
    height: 10,
    lineHeight: 1,
    color: active ? "var(--color-text-inverse)" : "var(--color-brand-mid)",
    fontWeight: 900,
    fontSize: 10,
  }) as React.CSSProperties,
  heatmapControls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
  } as React.CSSProperties,
  heatmapControlsLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.text,
    marginRight: 4,
  } as React.CSSProperties,
  heatmapResourceButtons: {
    display: "flex",
    gap: 6,
  } as React.CSSProperties,
  heatmapResourceButton: (active: boolean) => ({
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${active ? "var(--color-brand-primary)" : "var(--color-border-medium)"}`,
    backgroundColor: active ? "var(--color-brand-primary)" : "var(--color-bg-surface)",
    color: active ? "var(--color-text-inverse)" : "var(--color-text-primary)",
    fontSize: 12,
    fontWeight: active ? 700 : 600,
    cursor: "pointer",
  }) as React.CSSProperties,
} as const;
