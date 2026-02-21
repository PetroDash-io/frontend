"use client";

import React, {useMemo} from "react";
import {colors, COMPANY_COLORS} from "@/utils/constants";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
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

  return (
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
  );
}

const styles = {
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: 24,
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
} as const;
