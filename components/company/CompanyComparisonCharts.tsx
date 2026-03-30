"use client";

import React, {useMemo} from "react";
import {colors, COMPANY_COLORS} from "@/utils/constants";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell} from "recharts";
import {CompanyProductionData} from "@/app/types";
import {convertValueToUnit} from "@/utils/units";
import {exportToExcel} from "@/utils/excel";

interface CompanyComparisonChartsProps {
  companies: CompanyProductionData[];
  unit: string;
  fechaInicio?: string;
  fechaFin?: string;
}

const RESOURCE_NAMES = ["Petróleo", "Gas", "Agua"] as const;

const COMPARISON_CHARTS = [
  { title: "Producción Total - Comparación", metric: "total" as const, prefix: "produccion-total-comparacion", sheet: "Total" },
  { title: "Producción Promedio - Comparación", metric: "avg" as const, prefix: "produccion-promedio-comparacion", sheet: "Promedio" },
];

const PIE_CHART_CONFIG = [
  { title: "Petróleo - Distribución", key: "oil" as const },
  { title: "Gas - Distribución",     key: "gas" as const },
  { title: "Agua - Distribución",     key: "water" as const },
];

function getResourceValue(
  resource: (typeof RESOURCE_NAMES)[number],
  company: CompanyProductionData,
  unit: string,
  metric: "total" | "avg"
) {
  if (resource === "Petróleo") return convertValueToUnit(company.data.oil[metric], unit);
  if (resource === "Gas") return convertValueToUnit(company.data.gas[metric], unit);
  return convertValueToUnit(company.data.water[metric], unit);
}

function buildResourceChartData(
  companies: CompanyProductionData[],
  unit: string,
  metric: "total" | "avg"
) {
  return RESOURCE_NAMES.map((resource) => {
    const dataPoint: Record<string, string | number> = {name: resource};

    companies.forEach((company) => {
      dataPoint[company.company] = getResourceValue(resource, company, unit, metric);
    });

    return dataPoint;
  });
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
  if (typeof value === "number") {
    return value.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  return value;
};

interface ComparisonChartProps {
  title: string;
  data: Record<string, string | number>[];
  companies: CompanyProductionData[];
  onDownload: () => void;
}

function ComparisonChart({ title, data, companies, onDownload }: ComparisonChartProps) {
  return (
    <div style={styles.chartWrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <button
          onClick={onDownload}
          style={styles.downloadButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2F5A3F";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3F6B4F";
          }}
        >
          📊 Excel
        </button>
      </div>
      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} width={70} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            {companies.map((company, index) => (
              <Bar
                key={company.company}
                dataKey={company.company}
                fill={COMPANY_COLORS[index % COMPANY_COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CompanyComparisonCharts({
  companies,
  unit,
  fechaInicio,
  fechaFin,
}: CompanyComparisonChartsProps) {

  const generateFileName = (prefix: string) => {
    const today = new Date().toISOString().split('T')[0];
    const companyNames = companies.map(c => c.company.replace(/[^a-zA-Z0-9]/g, '-')).join('-vs-');
    let fileName = `${prefix}-${companyNames}`;
    if (fechaInicio) fileName += `-desde-${fechaInicio}`;
    if (fechaFin) fileName += `-hasta-${fechaFin}`;
    fileName += `-${today}`;
    return fileName;
  };

  const chartData = useMemo(() => {
    if (companies.length === 0) return { total: [], avg: [] };
    return {
      total: buildResourceChartData(companies, unit, "total"),
      avg:   buildResourceChartData(companies, unit, "avg"),
    };
  }, [companies, unit]);

  const handleDownload = (
    chartData: Record<string, string | number>[],
    prefix: string,
    sheetName: string
  ) => {
    const formattedData = chartData.map(row => {
      const formatted: Record<string, string | number> = { Recurso: row.name };
      companies.forEach(company => {
        formatted[company.company] = row[company.company] as number;
      });
      return formatted;
    });
    exportToExcel(formattedData, generateFileName(prefix), sheetName);
  };

  // Datos para los gráficos de torta (porcentajes)
  const pieChartsData = useMemo(() => {
    if (companies.length === 0) return { oil: [], gas: [], water: [] };
    const makePieData = (resource: "oil" | "gas" | "water") =>
      companies.map((company, index) => ({
        name: company.company,
        value: company.data[resource].percentage || 0,
        color: COMPANY_COLORS[index % COMPANY_COLORS.length],
      }));
    return { oil: makePieData("oil"), gas: makePieData("gas"), water: makePieData("water") };
  }, [companies]);

  const renderPieChart = (title: string, data: Array<{name: string, value: number, color: string}>) => {
    if (data.every(d => d.value === 0)) {
      return null;
    }

    return (
      <div style={styles.chartWrapper}>
        <h3 style={styles.title}>{title}</h3>
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.value.toFixed(1)}%`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : ''} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={styles.chartsContainer}>
        {COMPARISON_CHARTS.map(({ title, metric, prefix, sheet }) => (
          <ComparisonChart
            key={metric}
            title={title}
            data={chartData[metric]}
            companies={companies}
            onDownload={() => handleDownload(chartData[metric], prefix, sheet)}
          />
        ))}
      </div>

      {companies.length > 0 && companies.some(c => c.data.oil.percentage !== undefined) && (
        <>
          <h3 style={styles.sectionTitle}>Distribución Porcentual</h3>
          <div style={styles.pieChartsContainer}>
            {PIE_CHART_CONFIG.map(({ title, key }) => renderPieChart(title, pieChartsData[key]))}
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: 24,
  } as React.CSSProperties,
  pieChartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: 24,
    marginBottom: 24,
  } as React.CSSProperties,
  chartWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderRadius: 14,
    border: `1px solid ${colors.panelBorder}`,
    padding: 24,
    backgroundColor: "#fff",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  } as React.CSSProperties,
  downloadButton: {
    backgroundColor: "#3F6B4F",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.text,
    margin: "32px 0 16px 0",
  } as React.CSSProperties,
} as const;
