import { colors } from "@/utils/constants";
import React, { useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const M3_TO_BBL = 6.28981; // 1 m³ = 6.28981 bbl (barriles)
type Unit = "m3" | "bbl";

const SERIES_COLORS = {
    oil: "#3F6B4F",    // verde petróleo
    water: "#3A7CA5",  // azul agua
    gas: "#D97A00",    // naranja gas
  };

  
interface CurveDataPoint {
  date: string;
  oil: number | null;
  gas: number | null;
  water: number | null;
}


interface CurveChartProps {
    data: CurveDataPoint[];
}

export function CurveChart({ data }: CurveChartProps) {

    const [unit, setUnit] = useState<Unit>("m3");

    const convertedData = data.map(d => ({
      ...d,
      oil:
        d.oil == null
          ? null
          : unit === "bbl"
          ? d.oil * M3_TO_BBL
          : d.oil,
      water:
        d.water == null
          ? null
          : unit === "bbl"
          ? d.water * M3_TO_BBL
          : d.water,
      gas: d.gas, // gas queda en miles de m³
    }));

    return (
        <div style={styles.curveChartWrapper}>
            {/* Botón de unidades */}
            <div style={topControlsStyles.topControlsRow}>
        <button
            style={tabButtonStyle(unit === "m3")}
            onClick={() => setUnit("m3")}
        >
            m³
        </button>

        <button
            style={tabButtonStyle(unit === "bbl")}
            onClick={() => setUnit("bbl")}
        >
            BBL
        </button>
        </div>
                


            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={convertedData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis
                            tickFormatter={(v) =>
                                unit === "bbl" ? v.toFixed(0) : v.toFixed(1)
                            }
                        />
                    <Tooltip
                    formatter={(value: any, name: string | number) => {
                        if (name === "gas") {
                        return [`${Number(value).toFixed(2)} Mm³`, "Gas"];
                        }

                        const unitLabel = unit === "bbl" ? "BBL" : "m³";

                        if (name === "oil") {
                        return [`${Number(value).toFixed(2)} ${unitLabel}`, "Petróleo"];
                        }

                        if (name === "water") {
                        return [`${Number(value).toFixed(2)} ${unitLabel}`, "Agua"];
                        }

                        return value;
                    }}
                    />


                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="oil"
                            name={`Petróleo (${unit === "bbl" ? "BBL" : "m³"})`}
                            stroke={SERIES_COLORS.oil}
                            dot={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="gas"
                            name="Gas (Mm³)"
                            stroke={SERIES_COLORS.gas}
                            dot={false}
                        />

                            <Line
                            type="monotone"
                            dataKey="water"
                            name={`Agua (${unit === "bbl" ? "BBL" : "m³"})`}
                            stroke={SERIES_COLORS.water}
                            dot={false}
                            />

                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const styles = {
    curveChartWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        color: colors.textLight,
        marginTop: 50,
    } as React.CSSProperties,
} as const;


function tabButtonStyle(active: boolean): React.CSSProperties {
    return {
        padding: "8px 16px",
        borderRadius: 8,
        border: "1px solid #3F6B4F",
        backgroundColor: active ? "#3F6B4F" : "transparent",
        color: active ? "#F3EEE6" : "#3F6B4F",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
    };
}


const topControlsStyles = {
    topControlsRow: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties
} as const;