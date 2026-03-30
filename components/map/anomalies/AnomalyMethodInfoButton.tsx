import React, {useState} from "react";

export function AnomalyMethodInfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      <button
        type="button"
        style={styles.helpButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Como se calcula el grafico de anomalias"
        title="Como se calcula"
      >
        ?
      </button>

      {isOpen && (
        <div style={styles.popover}>
          <h4 style={styles.title}>Como se calcula</h4>
          <p style={styles.text}>Una anomalia es un mes cuya produccion queda fuera de lo esperable respecto a sus meses vecinos.</p>
          <ol style={styles.list}>
            <li>Se toma una ventana local de vecinos, excluyendo el mes analizado.</li>
            <li>Si no hay vecinos suficientes, no se decide (insufficient_context).</li>
            <li>Si hay dispersion local (MAD &gt; 0), se usa modified z-score.</li>
            <li>Si MAD = 0 (tramo plano), se usa desviacion relativa como fallback.</li>
          </ol>
          <p style={styles.text}>
            Regla principal: <strong>|modified_z| &gt; 3.5</strong>. Fallback: <strong>relative_deviation &gt; 0.7</strong>.
          </p>
          <p style={styles.footnote}>El metodo detecta meses raros, no diagnostica la causa operativa.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
  } as React.CSSProperties,
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "1px solid #9ca3af",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontWeight: 700,
    cursor: "pointer",
    lineHeight: 1,
  } as React.CSSProperties,
  popover: {
    position: "absolute",
    top: 30,
    right: 0,
    width: 360,
    maxWidth: "min(90vw, 360px)",
    zIndex: 20,
    borderRadius: 10,
    border: "1px solid #d8cdbf",
    backgroundColor: "#fffdf8",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    padding: 12,
  } as React.CSSProperties,
  title: {
    margin: "0 0 8px 0",
    fontSize: 14,
    color: "#2f3e34",
  } as React.CSSProperties,
  text: {
    margin: "0 0 8px 0",
    fontSize: 12,
    color: "#374151",
    lineHeight: 1.4,
  } as React.CSSProperties,
  list: {
    margin: "0 0 8px 16px",
    padding: 0,
    fontSize: 12,
    color: "#374151",
    lineHeight: 1.4,
  } as React.CSSProperties,
  footnote: {
    margin: 0,
    fontSize: 11,
    color: "#6b7280",
  } as React.CSSProperties,
} as const;
