"use client";

import React, {useMemo} from "react";
import {colors, COMPANY_COLORS} from "@/utils/constants";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell} from "recharts";
import {CompanyProductionData} from "@/app/types";
import {convertValueToUnit} from "@/utils/units";

interface CompanyComparisonChartsProps {
  companies: CompanyProductionData[];
  unit: string;
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
}

function ComparisonChart({ title, data, companies }: ComparisonChartProps) {
  return (
    <div style={styles.chartWrapper}>
      <h3 style={styles.title}>{title}</h3>
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
}: CompanyComparisonChartsProps) {
  // Transformar los datos para agrupar por tipo de recurso
  const totalChartData = useMemo(() => {
    if (companies.length === 0) return [];

    const resources = ["Petróleo", "Gas", "Agua"];
    return resources.map((resource) => {
      const dataPoint: Record<string, string | number> = { name: resource };
      
      companies.forEach((company) => {
        let value = 0;
        if (resource === "Petróleo") {
          value = convertValueToUnit(company.data.oil.total, unit);
        } else if (resource === "Gas") {
          value = convertValueToUnit(company.data.gas.total, unit);
        } else if (resource === "Agua") {
          value = convertValueToUnit(company.data.water.total, unit);
        }
        dataPoint[company.company] = value;
      });
      
      return dataPoint;
    });
  }, [companies, unit]);

  const avgChartData = useMemo(() => {
    if (companies.length === 0) return [];
    
    const resources = ["Petróleo", "Gas", "Agua"];
    return resources.map((resource) => {
      const dataPoint: Record<string, string | number> = { name: resource };
      
      companies.forEach((company) => {
        let value = 0;
        if (resource === "Petróleo") {
          value = convertValueToUnit(company.data.oil.total, unit);
        } else if (resource === "Gas") {
          value = convertValueToUnit(company.data.gas.total, unit);
        } else if (resource === "Agua") {
          value = convertValueToUnit(company.data.water.total, unit);
        }
        dataPoint[company.company] = value;
      });
      
      return dataPoint;
    });
  }, [companies, unit]);

  // Datos para los gráficos de torta (porcentajes)
  const pieChartsData = useMemo(() => {
    if (companies.length === 0) return { oil: [], gas: [], water: [] };
    
    const oilData = companies.map((company, index) => ({
      name: company.company,
      value: company.data.oil.percentage || 0,
      color: COMPANY_COLORS[index % COMPANY_COLORS.length]
    }));

    const gasData = companies.map((company, index) => ({
      name: company.company,
      value: company.data.gas.percentage || 0,
      color: COMPANY_COLORS[index % COMPANY_COLORS.length]
    }));

    const waterData = companies.map((company, index) => ({
      name: company.company,
      value: company.data.water.percentage || 0,
      color: COMPANY_COLORS[index % COMPANY_COLORS.length]
    }));

    return { oil: oilData, gas: gasData, water: waterData };
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
        <ComparisonChart
          title="Producción Total - Comparación"
          data={totalChartData}
          companies={companies}
        />
        <ComparisonChart
          title="Producción Promedio - Comparación"
          data={avgChartData}
          companies={companies}
        />
      </div>

      {companies.length > 0 && companies.some(c => c.data.oil.percentage !== undefined) && (
        <>
          <h3 style={styles.sectionTitle}>Distribución Porcentual</h3>
          <div style={styles.pieChartsContainer}>
            {renderPieChart("Petróleo - Distribución", pieChartsData.oil)}
            {renderPieChart("Gas - Distribución", pieChartsData.gas)}
            {renderPieChart("Agua - Distribución", pieChartsData.water)}
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
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.text,
    margin: "32px 0 16px 0",
  } as React.CSSProperties,
} as const;
