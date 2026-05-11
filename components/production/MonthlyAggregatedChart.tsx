"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from "recharts";
import { colors } from "@/utils/constants";

type DataPoint = {
  date: string;
  group: string;
  value: number;
  well_count: number;
};

type Props = {
  data: DataPoint[];
  selectedGroup: string;
  groupBy: string;
  metric: string;
};

export function MonthlyAggregatedChart({ data, selectedGroup, groupBy, metric }: Props) {
  const filtered = data
    .filter((d) => d.group === selectedGroup)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (filtered.length === 0) {
    return <p style={{ textAlign: "center", padding: 24 }}>Sin datos para el grupo seleccionado.</p>;
  }

  const groupLabel = groupBy === "company" ? "empresa" : "cuenca";
  const metricLabel = metric === "avg" ? "promedio" : "suma";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-AR", { month: "short", year: "2-digit" });
  };

  const formatValue = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const point = filtered.find((d) => d.date === label);
    return (
      <div style={{ background: "white", border: "1px solid #ccc", padding: 10, borderRadius: 6, fontSize: 13 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{formatDate(label)}</p>
        <p style={{ margin: "4px 0 0", color: colors.oil }}>
          Valor: {formatValue(payload[0].value)}
        </p>
        {point && (
          <p style={{ margin: "2px 0 0", color: "#888" }}>
            Pozos activos: {point.well_count}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: "var(--color-bg-surface)",
      padding: 24,
      borderRadius: 8,
      marginBottom: 24,
      border: `1px solid ${colors.panelBorder}`,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>
        Curva de vida · {selectedGroup} · agrupada por {groupLabel} · {metricLabel}
      </h3>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={filtered} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatValue} width={60} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors.oil}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}