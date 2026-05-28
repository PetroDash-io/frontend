import React from "react";
import { colors } from "@/utils/constants";
import { getWellColor } from "@/utils/helpers";
import type { WellClassification } from "@/utils/wellClassification";

interface MarkerOpts {
  selected: boolean;
  focused: boolean;
  status: string;
}

interface WellMarkerProps extends MarkerOpts {
  classification: WellClassification;
}

export function WellMarker({ classification, selected, focused, status }: WellMarkerProps) {
  if (classification === "no_conv") return <TriangleMarker selected={selected} focused={focused} status={status} />;
  if (classification === "unknown") return <XMarker selected={selected} focused={focused} status={status} />;
  return <DotMarker selected={selected} focused={focused} status={status} />;
}

function DotMarker({ selected, focused, status }: MarkerOpts) {
  return <span style={styles.dot({ selected, focused, status })} />;
}

function TriangleMarker({ selected, focused, status }: MarkerOpts) {
  return <span style={styles.triangle({ selected, focused, status })} />;
}

function XMarker({ selected, focused, status }: MarkerOpts) {
  const sz = selected ? 16 : 11;
  const color = getWellColor(status);
  return (
    <svg width={sz} height={sz} viewBox="0 0 12 12" style={styles.x({ selected, focused })}>
      <line x1="1" y1="1" x2="11" y2="11" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="11" y1="1" x2="1" y2="11" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const styles = {
  dot: (opts: MarkerOpts) => ({
    width: opts.selected ? 16 : 10,
    height: opts.selected ? 16 : 10,
    backgroundColor: getWellColor(opts.status),
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.4)",
    transition: "all 0.15s ease",
    boxShadow: opts.selected
      ? "0 0 0 4px rgba(45, 74, 45, 0.25), 0 1px 2px rgba(0,0,0,0.4)"
      : opts.focused
      ? `0 0 0 2px ${colors.accent}`
      : "0 1px 2px rgba(0,0,0,0.3)",
  }) as React.CSSProperties,
  triangle: (opts: MarkerOpts) => {
    const color = getWellColor(opts.status);
    const halfBase = opts.selected ? 9 : 6;
    const height = opts.selected ? 16 : 11;
    const baseOutline = "drop-shadow(0 0 0.6px rgba(0,0,0,0.7))";
    const halo = opts.selected
      ? "drop-shadow(0 0 5px rgba(45, 74, 45, 0.55))"
      : opts.focused
      ? `drop-shadow(0 0 3px ${colors.accent})`
      : "drop-shadow(0 1px 1px rgba(0,0,0,0.3))";
    return {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderLeft: `${halfBase}px solid transparent`,
      borderRight: `${halfBase}px solid transparent`,
      borderBottom: `${height}px solid ${color}`,
      transition: "all 0.15s ease",
      filter: `${baseOutline} ${halo}`,
    } as React.CSSProperties;
  },
  x: (opts: { selected: boolean; focused: boolean }) => ({
    display: "block",
    transition: "all 0.15s ease",
    filter: opts.selected
      ? "drop-shadow(0 0 5px rgba(45, 74, 45, 0.55))"
      : opts.focused
      ? `drop-shadow(0 0 3px ${colors.accent})`
      : "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
  }) as React.CSSProperties,
} as const;
