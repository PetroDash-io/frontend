import React from "react";

interface LegendItemProps {
  label: string;
  color?: string;
  shape?: "circle" | "triangle" | "x";
}

export function LegendItem({ color, shape, label }: LegendItemProps) {
  return (
    <div style={styles.wrapper}>
      {shape ? (
        <ShapeSwatch shape={shape} />
      ) : (
        <span style={{ ...styles.dot, backgroundColor: color }} />
      )}
      <span>{label}</span>
    </div>
  );
}

function ShapeSwatch({ shape }: { shape: "circle" | "triangle" | "x" }) {
  if (shape === "circle") {
    return <span style={styles.swatchCircle} />;
  }
  if (shape === "triangle") {
    return <span style={styles.swatchTriangle} />;
  }
  return (
    <svg width={10} height={10} viewBox="0 0 10 10" style={styles.swatchX}>
      <line x1="1" y1="1" x2="9" y2="9" stroke={neutral} strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="1" x2="1" y2="9" stroke={neutral} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const neutral = "var(--color-text-secondary)";

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  } as React.CSSProperties,
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.3)",
    flexShrink: 0,
  } as React.CSSProperties,
  swatchCircle: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: neutral,
    border: "1px solid rgba(0,0,0,0.3)",
    flexShrink: 0,
  } as React.CSSProperties,
  swatchTriangle: {
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderBottom: `11px solid ${neutral}`,
    filter: "drop-shadow(0 0 0.5px rgba(0,0,0,0.55))",
    flexShrink: 0,
  } as React.CSSProperties,
  swatchX: {
    display: "block",
    flexShrink: 0,
    filter: "drop-shadow(0 0 0.5px rgba(0,0,0,0.55))",
  } as React.CSSProperties,
} as const;
