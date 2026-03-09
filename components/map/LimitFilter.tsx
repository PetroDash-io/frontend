import {colors, MAX_WELLS} from "@/utils/constants";
import React from "react";

interface LimitFilterProps {
    limit: number;
    onDefineLimit: (filterName: string, value: number) => void;
    filterName: string;
}

export const LimitFilter = ({limit, onDefineLimit, filterName} : LimitFilterProps) => {
  const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!Number.isNaN(value) && value >= 1 && value <= MAX_WELLS) {
      onDefineLimit(filterName, value);
    }
  }

  return (
    <div style={styles.limitFilterContainer}>
      <label style={styles.limitLabel}>Cantidad de pozos</label>
      <input type="number" min={1} max={MAX_WELLS} value={limit} onChange={onChange} style={styles.limitInput}/>
    </div>
  )
}

const styles = {
  limitFilterContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  } as React.CSSProperties,
  limitLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.text,
  } as React.CSSProperties,
  limitInput: {
    width: 140,
    minHeight: 36,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #cfc4b5",
    backgroundColor: "#fff",
    color: "#2f3e34",
    fontSize: 13,
  } as React.CSSProperties,
} as const;
