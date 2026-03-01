import React from "react";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

interface ProductionBarChartData {
  name: string;
  oil: number;
  water: number;
  gas: number;
}

interface ProductionBarChartProps {
  data: ProductionBarChartData[];
  title: string;
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

const formatTooltip = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return value.toLocaleString('es-AR', { maximumFractionDigits: 2 });
  }
  return value;
};

export function ProductionBarChart({ data, title }: ProductionBarChartProps) {
    return (
        <div style={styles.chartWrapper}>
            <h3 style={styles.title}>{title}</h3>
            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={styles.barChartMargins}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatYAxis} width={60} />
                        <Tooltip formatter={formatTooltip} />
                        <Legend />
                        <Bar dataKey={PRODUCTION_TYPES.oil.name} fill={colors.oil} name={PRODUCTION_TYPES.oil.label} />
                        <Bar dataKey={PRODUCTION_TYPES.gas.name} fill={colors.gas} name={PRODUCTION_TYPES.gas.label} />
                        <Bar dataKey={PRODUCTION_TYPES.water.name} fill={colors.water} name={PRODUCTION_TYPES.water.label} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const styles = {
    chartWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        padding: 24,
        backgroundColor: "#fff",
    } as React.CSSProperties,
    title: {
        fontSize: 18,
        fontWeight: 600,
        color: colors.text,
        margin: 0,
    } as React.CSSProperties,
    barChartMargins: {
        top: 10,
        right: 20,
        left: 10,
        bottom: 10
    }
} as const;
