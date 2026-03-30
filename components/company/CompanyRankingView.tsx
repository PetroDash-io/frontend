"use client";

import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TopProductionFilters } from "@/app/types";
import { useTopProduction } from "@/hooks/useTopProduction";
import { colors, PIE_CHART_COLORS, AREAS_POR_PROVINCIA, WATERSHED_OPTIONS } from "@/utils/constants";
import { SelectFilter } from "@/components/common/SelectFilter";
import {YearMonthRangeFilters} from "@/components/common/YearMonthRangeFilters";

interface PieChartData {
  name: string;
  value: number;
  percentage: number;
}

const PRODUCTION_OPTIONS = [
  {value: "oil", label: "Petróleo"},
  {value: "gas", label: "Gas"},
  {value: "water", label: "Agua"},
];

const PROVINCE_OPTIONS = [
  {value: "Neuquen", label: "Neuquén"},
  {value: "Chubut", label: "Chubut"},
  {value: "Mendoza", label: "Mendoza"},
  {value: "La Pampa", label: "La Pampa"},
  {value: "Rio Negro", label: "Río Negro"},
];

const PRODUCTION_TYPE_LABEL: Record<"oil" | "gas" | "water", string> = {
  oil: "Petróleo",
  gas: "Gas",
  water: "Agua",
};

const formatTooltipValue = (value: number | string | undefined) => {
  if (value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return value.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  return value;
};

export function CompanyRankingView() {
  const [filters, setFilters] = useState<Partial<TopProductionFilters>>({
    tipo: "oil",
    limit: 10,
    watershed: "NEUQUINA",
  });

  const { data, loading, error } = useTopProduction(filters);

  const availableAreas = useMemo(() => {
    if (!filters.provincia) {
      return [];
    }
    return AREAS_POR_PROVINCIA[filters.provincia] || [];
  }, [filters.provincia]);

  const updateFilter = (filterName: string, value: string) => {
    if (value === "") {
      const newFilters = {...filters, limit: 10};
      delete newFilters[filterName as keyof TopProductionFilters];

      if (filterName === "provincia") {
        delete newFilters.area;
      }

      setFilters(newFilters);
    } else {
      setFilters((prev) => {
        const updatedFilters: Partial<TopProductionFilters> = {...prev, limit: 10};

        if (filterName === "tipo") {
          updatedFilters.tipo = value as "oil" | "gas" | "water";
        } else if (filterName === "watershed") {
          updatedFilters.watershed = value;
          delete updatedFilters.provincia;
          delete updatedFilters.area;
        } else if (filterName === "inicio_anio" || filterName === "fin_anio") {
          updatedFilters[filterName] = parseInt(value, 10);
        } else if (filterName === "inicio_mes" || filterName === "fin_mes") {
          updatedFilters[filterName] = parseInt(value, 10);
        } else if (filterName === "provincia") {
          updatedFilters.provincia = value;
          delete updatedFilters.area;
        } else if (filterName === "area") {
          updatedFilters.area = value;
        }

        return updatedFilters;
      });
    }
  };

  const chartData: PieChartData[] = useMemo(() => {
    if (!data || data.data.length === 0) {
      return [];
    }

    const totalProduction = data.data.reduce((sum, company) => sum + company.total_production, 0);

    return data.data.map((company) => ({
      name: company.company,
      value: company.total_production,
      percentage: totalProduction > 0 ? (company.total_production / totalProduction) * 100 : 0,
    }));
  }, [data]);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    if (
      cx == null ||
      cy == null ||
      midAngle == null ||
      innerRadius == null ||
      outerRadius == null ||
      percent == null
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = percent * 100;

    if (percentage < 3) {
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: 600 }}
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>Ranking de producción por empresas</h2>

      <div style={styles.filtersContainer}>
        <div style={styles.topFiltersRow}>
          <SelectFilter
            inputLabel="Cuenca"
            value={filters.watershed || "NEUQUINA"}
            filterName="watershed"
            onSelect={updateFilter}
            options={WATERSHED_OPTIONS}
          />

          <SelectFilter
            inputLabel="Tipo de Producción"
            value={filters.tipo || "oil"}
            filterName="tipo"
            onSelect={updateFilter}
            options={PRODUCTION_OPTIONS}
          />

          <SelectFilter
            inputLabel="Provincia"
            value={filters.provincia || ""}
            filterName="provincia"
            onSelect={updateFilter}
            defaultOptionLabel="Todas"
            options={PROVINCE_OPTIONS}
          />

          <SelectFilter
            inputLabel="Área"
            value={filters.area || ""}
            filterName="area"
            onSelect={updateFilter}
            defaultOptionLabel={filters.provincia ? "Todas" : "Seleccione provincia primero"}
            disabled={!filters.provincia}
            options={availableAreas}
          />
        </div>

        <div style={styles.dateRangeContainer}>
          <YearMonthRangeFilters
            onSelect={updateFilter}
            startYearValue={filters.inicio_anio?.toString() || ""}
            startMonthValue={filters.inicio_mes?.toString() || ""}
            endYearValue={filters.fin_anio?.toString() || ""}
            endMonthValue={filters.fin_mes?.toString() || ""}
            startYearLabel="Año Inicio"
            startMonthLabel="Mes Inicio"
            endYearLabel="Año Fin"
            endMonthLabel="Mes Fin"
          />
        </div>
      </div>

      {loading && <div style={styles.message}>Cargando datos...</div>}
      {error && <div style={styles.errorMessage}>Error: {error}</div>}

      {!loading && !error && chartData.length === 0 && (
        <div style={styles.noData}>No hay datos disponibles con los filtros seleccionados</div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <div style={styles.mainChartContainer}>
          <div style={styles.headerSection}>
            <h3 style={styles.chartTitle}>
              Top 10 Empresas - {PRODUCTION_TYPE_LABEL[filters.tipo || "oil"]}
            </h3>
            {data && (
              <div style={styles.headerStats}>
                <div style={styles.headerStat}>
                  <div style={styles.headerStatLabel}>Empresas</div>
                  <div style={styles.headerStatValue}>{data.data.length}</div>
                </div>
                <div style={styles.headerStat}>
                  <div style={styles.headerStatLabel}>Producción Total</div>
                  <div style={styles.headerStatValue}>
                    {data.data
                      .reduce((sum, company) => sum + company.total_production, 0)
                      .toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.chartAndRankingContainer}>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={140}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                        style={{filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"}}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} contentStyle={styles.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.rankingContainer}>
              <h4 style={styles.rankingTitle}>Ranking de Empresas</h4>
              <div style={styles.rankingList}>
                {chartData.map((company, index) => (
                  <div key={index} style={styles.rankingItem}>
                    <div style={styles.rankingPosition}>
                      <span style={{
                        ...styles.positionBadge,
                        backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
                      }}>
                        {index + 1}
                      </span>
                    </div>
                    <div style={styles.rankingInfo}>
                      <div style={styles.companyName}>{company.name}</div>
                      <div style={styles.productionInfo}>
                        <span style={styles.productionValue}>
                          {company.value.toLocaleString("es-AR", { maximumFractionDigits: 2 })}
                        </span>
                        <span style={styles.productionPercentage}>
                          ({company.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 24,
    backgroundColor: colors.bg,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.text,
  },
  filtersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 20,
    backgroundColor: colors.filtersBg,
    borderRadius: 12,
    border: `1px solid ${colors.panelBorder}`,
  },
  topFiltersRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  dateRangeContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  mainChartContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  headerSection: {
    marginBottom: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  },
  headerStats: {
    display: "flex",
    gap: 24,
  },
  headerStat: {
    textAlign: "center",
  },
  headerStatLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  headerStatValue: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.primary,
  },
  chartAndRankingContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: 32,
    alignItems: "start",
  },
  chartWrapper: {
    width: "100%",
    height: 450,
  },
  rankingContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 20,
    height: 450,
    overflowY: "auto",
  },
  rankingTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 16,
    marginTop: 0,
  },
  rankingList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  rankingItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  rankingPosition: {
    flexShrink: 0,
  },
  positionBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "50%",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
  },
  rankingInfo: {
    flex: 1,
    minWidth: 0,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  productionInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
  },
  productionValue: {
    color: "#64748b",
    fontWeight: 500,
  },
  productionPercentage: {
    color: "#94a3b8",
    fontSize: 12,
  },
  message: {
    textAlign: "center",
    padding: 40,
    fontSize: 16,
    color: colors.text,
  },
  errorMessage: {
    textAlign: "center",
    padding: 40,
    fontSize: 16,
    color: "#d32f2f",
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  noData: {
    textAlign: "center",
    padding: 60,
    color: "#999",
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 12,
  },
  tooltip: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};

export function RankingIcon({width = 18, height = 18}: {width?: number; height?: number}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2h8v4a4 4 0 01-4 4 4 4 0 01-4-4V2z" stroke="#2F3E34" strokeWidth="2" />
      <path d="M6 6h12v3a5 5 0 01-5 5h-2a5 5 0 01-5-5V6z" stroke="#2F3E34" strokeWidth="2" />
      <path d="M9 18h6v4H9v-4z" stroke="#2F3E34" strokeWidth="2" />
    </svg>
  );
}
