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
import { exportMultipleSheetsToExcel } from "@/utils/excel";

interface CompaniesBarChartProps {
  companies: Company[];
  title?: string;
  maxCompanies?: number;
  watershed?: string;
}

// Paleta de colores alineada con PetroDash
const COLORS = [
  "var(--color-cat-1)",
  "var(--color-cat-2)",
  "var(--color-cat-3)",
  "var(--color-cat-4)",
  "var(--color-cat-5)",
  "var(--color-cat-6)",
  "var(--color-cat-7)",
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
  value?: number | string | boolean | null;
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
      fill="var(--color-text-secondary)"
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
  watershed,
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
    const watershedSlug = watershed
      ? watershed.replace(/[^a-zA-Z0-9]/g, "-")
      : "todas";
    const fileName = `empresas-top${maxCompanies}-${watershedSlug}-${today}`;

    const filterSheet = [
      { Filtro: "Cuenca", Valor: watershed || "Todas" },
      { Filtro: "Top", Valor: String(maxCompanies) },
    ];

    exportMultipleSheetsToExcel(
      [
        { data: dataToExport, sheetName: "Top Empresas" },
        { data: filterSheet, sheetName: "Filtros" },
      ],
      fileName
    );
  };

  if (!companies || companies.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.cardHeader}>
          <span className="card-label">Ranking de empresas</span>
        </div>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.noData}>No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.cardHeader}>
        <span className="card-label">Ranking de empresas</span>
      </div>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <button
          onClick={handleDownloadExcel}
          style={styles.downloadButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-brand-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-brand-mid)";
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />

          {/* Eje X ahora es numérico (horizontal) */}
          <XAxis
            type="number"
            tickFormatter={formatXAxis}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={280}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
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
    backgroundColor: "var(--color-bg-surface)",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--color-border-subtle)",
  },
  cardHeader: {
    paddingBottom: "12px",
    marginBottom: "8px",
    borderBottom: "1px solid var(--color-border-subtle)",
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
    color: "var(--color-text-primary)",
    margin: 0,
  },
  downloadButton: {
    backgroundColor: "var(--color-brand-mid)",
    color: "var(--color-text-inverse)",
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
    color: "var(--color-text-muted)",
    fontSize: "15px",
  },
  tooltip: {
    backgroundColor: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-subtle)",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
};
