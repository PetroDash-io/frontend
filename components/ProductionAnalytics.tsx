"use client";

import React, { useState, useMemo } from "react";
import { colors } from "@/utils/constants";
import { useCompanies } from "@/hooks/useCompanies";
import { useProductionAggregates } from "@/hooks/useProductionAggregates";
import { ProductionBarChart } from "@/components/ProductionBarChart";
import { ProductionAggregatesFilters } from "@/app/types";

export function ProductionAnalytics() {
  const [filters, setFilters] = useState<Partial<ProductionAggregatesFilters>>({});

  const { companies, loading: loadingCompanies, error: errorCompanies } = useCompanies();
  const { data: productionData, loading: loadingProduction, error: errorProduction } = useProductionAggregates(filters);
  const M3_TO_BBL = 6.28981;
  type Unit = "m3" | "bbl";
  
  const [unit, setUnit] = useState<Unit>("m3");

  const totalChartData = useMemo(() => {
    if (!productionData) return [];
  
    return [
      {
        name: "Producción Total",
        petróleo:
          unit === "bbl"
            ? productionData.oil.total * M3_TO_BBL
            : productionData.oil.total,
        agua:
          unit === "bbl"
            ? productionData.water.total * M3_TO_BBL
            : productionData.water.total,
        gas: productionData.gas.total, // NO se convierte
      },
    ];
  }, [productionData, unit]);

  const avgChartData = useMemo(() => {
    if (!productionData) return [];
  
    return [
      {
        name: "Producción Promedio",
        petróleo:
          unit === "bbl"
            ? productionData.oil.avg * M3_TO_BBL
            : productionData.oil.avg,
        agua:
          unit === "bbl"
            ? productionData.water.avg * M3_TO_BBL
            : productionData.water.avg,
        gas: productionData.gas.avg,
      },
    ];
  }, [productionData, unit]);
  

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, empresa: value });
    } else {
      const { empresa, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, inicio_anio: Number(value) });
    } else {
      const { inicio_anio, inicio_mes, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, inicio_mes: Number(value) });
    } else {
      const { inicio_mes, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, fin_anio: Number(value) });
    } else {
      const { fin_anio, fin_mes, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setFilters({ ...filters, fin_mes: Number(value) });
    } else {
      const { fin_mes, ...rest } = filters;
      setFilters(rest);
    }
  };

  const startYear = 2013;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const showResults = filters.empresa || filters.inicio_anio || filters.fin_anio;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Análisis de Producción por Empresa</h2>

      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>
            Empresa:
            <select
              value={filters.empresa || ""}
              onChange={handleCompanyChange}
              style={styles.select}
              disabled={loadingCompanies}
            >
              <option value="">Seleccione una empresa</option>
              {companies.map((company, index) => (
                <option key={`${company.empresa}-${index}`} value={company.empresa}>
                  {(company.empresa && company.empresa.trim()) ? company.empresa : "(Sin nombre de empresa)"} ({company.cantidad_pozos} pozos)
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={styles.dateRangeContainer}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>
              Año inicio:
              <select
                value={filters.inicio_anio || ""}
                onChange={handleStartYearChange}
                style={styles.select}
              >
                <option value="">Seleccionar</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>
              Mes inicio:
              <select
                value={filters.inicio_mes || ""}
                onChange={handleStartMonthChange}
                style={styles.select}
                disabled={!filters.inicio_anio}
              >
                <option value="">Todos</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>
              Año fin:
              <select
                value={filters.fin_anio || ""}
                onChange={handleEndYearChange}
                style={styles.select}
              >
                <option value="">Seleccionar</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>
              Mes fin:
              <select
                value={filters.fin_mes || ""}
                onChange={handleEndMonthChange}
                style={styles.select}
                disabled={!filters.fin_anio}
              >
                <option value="">Todos</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {errorCompanies && (
        <div style={styles.error}>Error al cargar empresas: {errorCompanies}</div>
      )}

      {errorProduction && (
        <div style={styles.error}>Error al cargar datos de producción: {errorProduction}</div>
      )}

      {!showResults && (
        <div style={styles.placeholder}>
          <p>Seleccione una empresa o rango de fechas para ver las métricas de producción</p>
        </div>
      )}

      {showResults && loadingProduction && (
        <div style={styles.loading}>
          <p>Cargando datos de producción...</p>
        </div>
      )}

      <div style={topControlsStyles.topControlsRow}>
        <button
          style={tabButtonStyle(unit === "m3")}
          onClick={() => setUnit("m3")}
        >
          m³
        </button>

        <button
          style={tabButtonStyle(unit === "bbl")}
          onClick={() => setUnit("bbl")}
        >
          BBL
        </button>
      </div>


      {showResults && !loadingProduction && productionData && (
        <div style={styles.chartsContainer}>
          <ProductionBarChart data={totalChartData} title="Producción Total" />
          <ProductionBarChart data={avgChartData} title="Producción Promedio" />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 24,
    backgroundColor: colors.bg,
  } as React.CSSProperties,
  heading: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  } as React.CSSProperties,
  filtersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 20,
    backgroundColor: colors.filtersBg,
    borderRadius: 12,
    border: `1px solid ${colors.panelBorder}`,
  } as React.CSSProperties,
  dateRangeContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  } as React.CSSProperties,
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  } as React.CSSProperties,
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.text,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  } as React.CSSProperties,
  select: {
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${colors.secondary}`,
    backgroundColor: "#fff",
    fontSize: 14,
    color: colors.text,
    cursor: "pointer",
  } as React.CSSProperties,
  input: {
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${colors.secondary}`,
    backgroundColor: "#fff",
    fontSize: 14,
    color: colors.text,
  } as React.CSSProperties,
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 24,
  } as React.CSSProperties,
  placeholder: {
    padding: 40,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    border: `1px solid ${colors.panelBorder}`,
    color: colors.text,
  } as React.CSSProperties,
  loading: {
    padding: 40,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    border: `1px solid ${colors.panelBorder}`,
    color: colors.text,
  } as React.CSSProperties,
  error: {
    padding: 16,
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    borderRadius: 8,
    fontSize: 14,
  } as React.CSSProperties,
} as const;

function tabButtonStyle(active: boolean): React.CSSProperties {
    return {
        padding: "8px 16px",
        borderRadius: 8,
        border: "1px solid #3F6B4F",
        backgroundColor: active ? "#3F6B4F" : "transparent",
        color: active ? "#F3EEE6" : "#3F6B4F",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
    };
}


const topControlsStyles = {
    topControlsRow: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties
} as const;