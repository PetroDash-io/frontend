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
} from "recharts";
import { Company } from "@/app/types";
import { exportToExcel } from "@/utils/excel";

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

type BarLabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
};

const renderBarLabel = ({x, y, width, height, value}: BarLabelProps) => {
  if (
    x == null ||
    y == null ||
    width == null ||
    height == null ||
    value == null
  ) {
    return null;
  }

  const xNumber = Number(x);
  const yNumber = Number(y);
  const widthNumber = Number(width);
  const heightNumber = Number(height);

  if (
    Number.isNaN(xNumber) ||
    Number.isNaN(yNumber) ||
    Number.isNaN(widthNumber) ||
    Number.isNaN(heightNumber)
  ) {
    return null;
  }

  return (
    <text
      x={xNumber + widthNumber + 10}
      y={yNumber + heightNumber / 2}
      fill="#374151"
      fontSize={13}
      fontWeight={600}
      textAnchor="start"
      dominantBaseline="middle"
    >
      {Number(value).toLocaleString("es-AR")}
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

  const handleDownloadExcel = () => {
    const dataToExport = chartData.map((item) => ({
      Empresa: item.name,
      'Cantidad de Pozos': item.pozos,
    }));

    const today = new Date().toISOString().split('T')[0];
    const fileName = `empresas-top${maxCompanies}-${today}`;

    exportToExcel(
      dataToExport,
      fileName,
      'Top Empresas'
    );
  };

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
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <button
          onClick={handleDownloadExcel}
          style={styles.downloadButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2F5A3F";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3F6B4F";
          }}
        >
          📊 Descargar Excel
        </button>
      </div>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1F2937",
    margin: 0,
  },
  downloadButton: {
    backgroundColor: "#3F6B4F",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background-color 0.2s",
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
