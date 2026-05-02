import React from "react";
import {colors} from "@/utils/constants";
import type {HeatmapResource} from "@/hooks/useWellsHeatmap";

type MapHeatmapControlsProps = {
  selectedResource: HeatmapResource;
  onSelectResource: (resource: HeatmapResource) => void;
};

const RESOURCE_OPTIONS: Array<{value: HeatmapResource; label: string}> = [
  {value: "oil", label: "Petróleo"},
  {value: "gas", label: "Gas"},
  {value: "water", label: "Agua"},
];

const RESOURCE_COLORS: Record<HeatmapResource, string> = {
  oil: colors.oil,
  gas: colors.gas,
  water: colors.water,
};

export function MapHeatmapControls({selectedResource, onSelectResource}: MapHeatmapControlsProps) {
  return (
    <div style={styles.toggleBar}>
      <div style={styles.toggleLabel}>Recurso:</div>
      <div style={styles.resourceButtons}>
        {RESOURCE_OPTIONS.map(({value, label}) => (
          <button
            key={value}
            type="button"
            style={styles.resourceBtn(selectedResource === value, value)}
            onClick={() => onSelectResource(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  resourceButtons: {
    display: "flex",
    gap: 6,
    marginLeft: "auto",
  } as React.CSSProperties,
  resourceBtn: (active: boolean, resource: HeatmapResource) => ({
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${RESOURCE_COLORS[resource]}`,
    backgroundColor: active ? RESOURCE_COLORS[resource] : "transparent",
    color: active ? "#fff" : colors.text,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    fontSize: 12,
    transition: "all 0.18s ease",
  }) as React.CSSProperties,
} as const;
