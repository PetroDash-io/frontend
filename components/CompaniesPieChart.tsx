'use client';

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Company } from "@/app/types";

interface CompaniesPieChartProps {
  companies: Company[];
  title?: string;
  maxCompanies?: number;
}

// Paleta de colores alineada con PetroDash
const COLORS = [
  "#3F6B4F", // Verde principal PetroDash
  "#D6A23A", // Dorado/Amarillo
  "#4B2A1A", // Marrón oscuro
  "#D97A00", // Naranja
  "#3A7CA5", // Azul agua
  "#2F3E34", // Verde muy oscuro
  "#8B6F47", // Marrón claro
  "#5A8F7B", // Verde agua
  "#B8860B", // Dorado oscuro
  "#6B4423", // Marrón tierra
  "#6B7280", // Gris para "Otros"
];

interface PieChartData {
  name: string;
  value: number;
  percentage: number;
}

const formatTooltipValue = (value: number | string | undefined) => {
  if (value === undefined) {
    return '';
  }
  if (typeof value === 'number') {
    return value.toLocaleString('es-AR');
  }
  return value;
};

export function CompaniesPieChart({ 
  companies, 
  title = "Distribución de Pozos por Empresa",
  maxCompanies = 10 
}: CompaniesPieChartProps) {
  const chartData = useMemo(() => {
    if (!companies || companies.length === 0) {
      return [];
    }

    const sortedCompanies = [...companies].sort(
      (a, b) => b.cantidad_pozos - a.cantidad_pozos
    );

    const topCompanies = sortedCompanies.slice(0, maxCompanies);
    const totalWells = companies.reduce((sum, company) => sum + company.cantidad_pozos, 0);

    const data: PieChartData[] = topCompanies.map((company) => ({
      name: company.empresa,
      value: company.cantidad_pozos,
      percentage: totalWells > 0 ? (company.cantidad_pozos / totalWells) * 100 : 0,
    }));

    if (sortedCompanies.length > maxCompanies) {
      const otherWells = sortedCompanies
        .slice(maxCompanies)
        .reduce((sum, company) => sum + company.cantidad_pozos, 0);
      
      if (otherWells > 0) {
        data.push({
          name: "Otros",
          value: otherWells,
          percentage: totalWells > 0 ? (otherWells / totalWells) * 100 : 0,
        });
      }
    }

    return data;
  }, [companies, maxCompanies]);

  const renderCustomLabel = (props: { 
    cx?: number; 
    cy?: number; 
    midAngle?: number; 
    innerRadius?: number; 
    outerRadius?: number; 
    percent?: number 
  }) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    
    if (cx === undefined || cy === undefined || midAngle === undefined || 
        innerRadius === undefined || outerRadius === undefined || percent === undefined) {
      return null;
    }

    // Solo mostrar label si el porcentaje es mayor al 2%
    if (percent < 0.02) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#1F2937" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
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
      <h3 style={styles.title}>{title}</h3>
      <div style={{ height: 450 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              labelLine={true}
              label={renderCustomLabel}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={styles.tooltip}
            />
            <Legend 
              verticalAlign="bottom" 
              height={60}
              formatter={(value: string) => <span style={styles.legendText}>{value}</span>}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
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
  legendText: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: 500,
  },
};
