import React from "react";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";
import {ProductionResource} from "@/components/map/anomalies/types";
import {UNITS} from "@/utils/units";

interface ResourceSelectorProps {
  selectedResource: ProductionResource;
  onResourceChange: (resource: ProductionResource) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
}

const resourceOptions: SelectFilterOption[] = [
  {value: "oil", label: "Petroleo"},
  {value: "gas", label: "Gas"},
  {value: "water", label: "Agua"},
];

const isProductionResource = (value: string): value is ProductionResource => {
  return value === "oil" || value === "gas" || value === "water";
};

export function ResourceSelector({
  selectedResource,
  onResourceChange,
  unit,
  onUnitChange,
}: ResourceSelectorProps) {
  const handleResourceSelect = (_filterName: string, value: string) => {
    if (!isProductionResource(value)) return;
    onResourceChange(value);
  };

  return (
    <div style={styles.container}>
      <SelectFilter
        value={selectedResource}
        onSelect={handleResourceSelect}
        filterName="resource"
        inputLabel="Recurso"
        options={resourceOptions}
      />

      {selectedResource !== "gas" && (
        <div role="tablist" style={styles.unitSwitchContainer}>
          <button style={styles.unitButton(unit === UNITS.m3)} onClick={() => onUnitChange(UNITS.m3)}>
            {UNITS.m3}
          </button>
          <button style={styles.unitButton(unit === UNITS.bbl)} onClick={() => onUnitChange(UNITS.bbl)}>
            {UNITS.bbl}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
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
