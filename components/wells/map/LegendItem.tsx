
interface LegendItemProps {
  label: string;
  color?: string;
  shape?: "circle" | "triangle";
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

function ShapeSwatch({ shape }: { shape: "circle" | "triangle" }) {
  if (shape === "circle") {
    return <span style={styles.swatchCircle} />;
  }
  return <span style={styles.swatchTriangle} />;
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
} as const;
