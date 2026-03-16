import React from "react";
import {ProductionResource} from "@/app/types/anomalies";
import {UNITS} from "@/utils/units";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {colors} from "@/utils/constants";

export interface AnomalyChartPoint {
  date: string;
  dateTs: number;
  resourceProduction: number;
  anomalyMarker: number | null;
}

interface WellAnomaliesChartProps {
  data: AnomalyChartPoint[];
  xAxisDomain: [number | "dataMin", number | "dataMax"];
  selectedResource: ProductionResource;
  selectedResourceLabel: string;
  selectedColor: string;
  unit: string;
}

export function WellAnomaliesChart({
  data,
  xAxisDomain,
  selectedResource,
  selectedResourceLabel,
  selectedColor,
  unit,
}: WellAnomaliesChartProps) {
  const unitLabel = selectedResource === "gas" ? UNITS.mm3 : unit;

  const yAxisTickFormatter = (value: number) => {
    if (selectedResource === "gas") return value.toFixed(2);
    return unit === UNITS.bbl ? value.toFixed(0) : value.toFixed(1);
  };

  const tooltipFormatter = (value?: number) => [
    `${Number(value ?? 0).toFixed(2)} ${unitLabel}`,
    selectedResourceLabel,
  ];

  const xAxisTickFormatter = (value: number) => {
    const date = new Date(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const tooltipLabelFormatter = (label: unknown) => {
    if (typeof label !== "number") return String(label ?? "");
    const date = new Date(label);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <div style={styles.wrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{top: 10, right: 20, left: 0, bottom: 12}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateTs"
            type="number"
            scale="time"
            domain={xAxisDomain}
            allowDataOverflow
            tickFormatter={xAxisTickFormatter}
            minTickGap={18}
          />
          <YAxis tickFormatter={yAxisTickFormatter} />
          <Tooltip formatter={tooltipFormatter} labelFormatter={tooltipLabelFormatter} />
          <Legend />

          <Line
            type="linear"
            dataKey="resourceProduction"
            name={`${selectedResourceLabel} (${unitLabel})`}
            stroke={selectedColor}
            strokeWidth={2}
            dot={{r: 3, strokeWidth: 1, fill: "#ffffff"}}
            activeDot={{r: 4}}
          />

          <Line
            type="linear"
            dataKey="anomalyMarker"
            name="Anomalia"
            stroke="transparent"
            connectNulls={false}
            dot={{r: 6, fill: "#dc2626", stroke: "#ffffff", strokeWidth: 2}}
            activeDot={{r: 7, fill: "#dc2626", stroke: "#ffffff", strokeWidth: 2}}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  wrapper: {
    height: 320,
    borderRadius: 14,
    border: `1px solid ${colors.panelBorder}`,
    backgroundColor: "#fff",
  } as React.CSSProperties,
} as const;
