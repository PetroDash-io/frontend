'use client';

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { Company } from "@/app/types";

interface CompaniesBarChartProps {
  companies: Company[];
  title?: string;
  maxCompanies?: number;
}

// Paleta de colores alineada con PetroDash
const COLORS = [
  "#3F6B4F",
  "#D6A23A",
  "#4B2A1A",
  "#D97A00",
  "#3A7CA5",
  "#2F3E34",
  "#8B6F47",
];

interface BarChartData {
  name: string;
  pozos: number;
}

const formatTooltipValue = (value: number | string | undefined) => {
  if (value === undefined) return "";
  if (typeof value === "number") {
    return `${value.toLocaleString("es-AR")} pozos`;
  }
  return value;
};

const formatXAxis = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

const renderBarLabel = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) => {
  const { x, y, width, height, value } = props;

  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined ||
    value === undefined
  ) {
    return null;
  }

  return (
    <text
      x={x + width + 10}
      y={y + height / 2 + 5}
      fill="#374151"
      fontSize={13}
      fontWeight={600}
      textAnchor="start"
    >
      {value.toLocaleString("es-AR")}
    </text>
  );
};

export function CompaniesBarChart({
  companies,
  title = "Top 7 Empresas por Cantidad de Pozos",
  maxCompanies = 7,
}: CompaniesBarChartProps) {
  const chartData = useMemo(() => {
    if (!companies || companies.length === 0) return [];

    const sortedCompanies = [...companies].sort(
      (a, b) => a.cantidad_pozos - b.cantidad_pozos
    );

    const topCompanies = sortedCompanies.slice(-maxCompanies);

    return topCompanies.map((company) => ({
      name: company.empresa,
      pozos: company.cantidad_pozos,
    }));
  }, [companies, maxCompanies]);

  if (!companies || companies.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.noData}>No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          layout="vertical"   
          margin={{ top: 20, right: 130, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* Eje X ahora es numérico (horizontal) */}
          <XAxis
            type="number"
            tickFormatter={formatXAxis}
            tick={{ fill: "#374151", fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={280}
            tick={{ fill: "#374151", fontSize: 12 }}
          />

          <Tooltip formatter={formatTooltipValue} contentStyle={styles.tooltip} />

          <Bar
              dataKey="pozos"
              radius={[0, 8, 8, 0]}
              barSize={35}
              label={renderBarLabel}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1F2937",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#9CA3AF",
    fontSize: "15px",
  },
  tooltip: {
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
};
