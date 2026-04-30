import React, {useState} from "react";
import {colors} from "@/utils/constants";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const M3_TO_BBL = 6.28981;
type Unit = "m3" | "bbl";

interface ProductionCurvePoint {
  date: string;
  oil: number | null;
  gas: number | null;
  water: number | null;
}

export function ProductionCurveChart({data}: {data: ProductionCurvePoint[]}) {
  const [unit, setUnit] = useState<Unit>("m3");

  const convertedData = data.map((d) => ({
    ...d,
    oil: d.oil == null ? null : unit === "bbl" ? d.oil * M3_TO_BBL : d.oil,
    water: d.water == null ? null : unit === "bbl" ? d.water * M3_TO_BBL : d.water,
    gas: d.gas,
  }));

  return (
    <div style={styles.wrapper}>
      <div style={styles.controlsRow}>
        <button style={tabButtonStyle(unit === "m3")} onClick={() => setUnit("m3")}>m³</button>
        <button style={tabButtonStyle(unit === "bbl")} onClick={() => setUnit("bbl")}>BBL</button>
      </div>

      <div style={{height: 320}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={convertedData} margin={{top: 10, right: 20, left: 0, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={18} />
            <YAxis tickFormatter={(v) => (unit === "bbl" ? v.toFixed(0) : v.toFixed(1))} />
            <Tooltip
              formatter={(value: number | string | undefined, name?: string | number) => {
                if (name === "gas") return [`${Number(value).toFixed(2)} Mm³`, "Gas"];
                const unitLabel = unit === "bbl" ? "BBL" : "m³";
                if (name === "oil") return [`${Number(value).toFixed(2)} ${unitLabel}`, "Petróleo"];
                if (name === "water") return [`${Number(value).toFixed(2)} ${unitLabel}`, "Agua"];
                return String(value);
              }}
            />
            <Legend />

            <Line type="monotone" dataKey="oil" name={`Petróleo (${unit === "bbl" ? "BBL" : "m³"})`} stroke="var(--color-petroleum)" dot={false} />
            <Line type="monotone" dataKey="gas" name="Gas (Mm³)" stroke="var(--color-gas)" dot={false} />
            <Line type="monotone" dataKey="water" name={`Agua (${unit === "bbl" ? "BBL" : "m³"})`} stroke="var(--color-water)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderRadius: 14,
    border: `1px solid ${colors.panelBorder}`,
    backgroundColor: "var(--color-bg-surface)",
  } as React.CSSProperties,
  controlsRow: {
    display: "flex",
    gap: 12,
    padding: "12px 24px",
  } as React.CSSProperties,
};

function tabButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid var(--color-brand-mid)",
    backgroundColor: active ? "var(--color-brand-mid)" : "transparent",
    color: active ? "var(--color-text-inverse)" : "var(--color-brand-mid)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  };
}
