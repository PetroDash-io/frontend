import React from "react";
import { ClassificationFilter as ClassificationFilterValue } from "@/app/types/wellFilters";

interface ClassificationFilterProps {
  value: ClassificationFilterValue;
  onChange: (v: ClassificationFilterValue) => void;
}

const OPTIONS: { value: ClassificationFilterValue; label: string; glyph?: "circle" | "triangle" }[] = [
  { value: "all",  label: "Todos" },
  { value: "conv", label: "Convencional", glyph: "circle" },
  { value: "no_conv",   label: "No convencional", glyph: "triangle" },
];

export function ClassificationFilter({ value, onChange }: ClassificationFilterProps) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>Tipo</span>
      <div style={styles.pill}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            style={styles.btn(value === opt.value)}
            onClick={() => { if (value !== opt.value) onChange(opt.value); }}
          >
            {opt.glyph === "circle" && <span style={styles.glyphCircle} />}
            {opt.glyph === "triangle" && <span style={styles.glyphTriangle} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    gridColumn: "span 2",
  } as React.CSSProperties,
  label: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "var(--color-text-secondary)",
    textTransform: "uppercase",
  } as React.CSSProperties,
  pill: {
    display: "inline-flex",
    alignItems: "center",
    padding: 4,
    borderRadius: 999,
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-bg-surface)",
    height: 40,
    boxSizing: "border-box",
    alignSelf: "flex-start",
  } as React.CSSProperties,
  btn: (active: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${active ? "var(--color-brand-mid)" : "transparent"}`,
    backgroundColor: active ? "var(--color-brand-mid)" : "transparent",
    color: active ? "var(--color-text-inverse)" : "var(--color-brand-mid)",
    cursor: active ? "default" : "pointer",
    fontWeight: 700,
    fontSize: 13,
    transition: "all 0.18s ease",
    boxShadow: active ? "0 4px 10px var(--color-brand-glow)" : "none",
    whiteSpace: "nowrap",
  }) as React.CSSProperties,
  glyphCircle: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    flexShrink: 0,
  } as React.CSSProperties,
  glyphTriangle: {
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: "9px solid currentColor",
    flexShrink: 0,
  } as React.CSSProperties,
} as const;
