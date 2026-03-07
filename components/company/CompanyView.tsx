"use client";

import React, {useMemo, useState} from "react";
import {colors, MONTHS, YEARS} from "@/utils/constants";
import {useCompanies} from "@/hooks/useCompanies";
import {useProductionAggregates} from "@/hooks/useProductionAggregates";
import {useCompanyComparison} from "@/hooks/useCompanyComparison";
import {ProductionBarChart} from "@/components/company/ProductionBarChart";
import {CompanyComparisonPanel} from "@/components/company/CompanyComparisonPanel";
import {CompanyComparisonCharts} from "@/components/company/CompanyComparisonCharts";
import {CompaniesBarChart} from "@/components/common/CompaniesBarChart";
import {ComparisonFilters, ProductionAggregatesFilters} from "@/app/types";
import {UnitTabs} from "@/components/common/UnitTabs";
import {SelectFilterOption, SelectFilter} from "@/components/common/SelectFilter";
import {useUnit} from "@/hooks/useUnit";
import {convertValueToUnit} from "@/utils/units";

export function CompanyView() {
  const [filters, setFilters] = useState<Partial<ProductionAggregatesFilters>>({});
  const [comparisonFilters, setComparisonFilters] = useState<Partial<ComparisonFilters>>({});
  const [maxCompanies, setMaxCompanies] = useState<number>(7);

  const { companies, loading: loadingCompanies, error: errorCompanies } = useCompanies();
  const { data: productionData, loading: loadingProduction, error: errorProduction } = useProductionAggregates(filters);
  const { data: comparisonData, loading: loadingComparison, error: errorComparison } = useCompanyComparison(comparisonFilters);

  const {unit, setUnit} = useUnit();

  const totalChartData = useMemo(() => {
    if (!productionData) return [];
    return [{
      name: "Producción total",
      oil: convertValueToUnit(productionData.oil.total, unit),
      water: convertValueToUnit(productionData.water.total, unit),
      gas: convertValueToUnit(productionData.gas.total, unit)
    }];
  }, [productionData, unit]);

  const avgChartData = useMemo(() => {
    if (!productionData) return [];
    return [{
      name: "Producción promedio",
      oil: convertValueToUnit(productionData.oil.avg, unit),
      water: convertValueToUnit(productionData.water.avg, unit),
      gas: convertValueToUnit(productionData.gas.avg, unit),
    }];
  }, [productionData, unit]);

  const updateProductionFilters = (filterName: string, value: unknown) => {
    setFilters((previousValues) => ({...previousValues, [filterName]: value}));
  }

  const updateComparisonFilters = (filterName: string, value: unknown) => {
    setComparisonFilters((previousValues) => ({...previousValues, [filterName]: value}));
  }

  const companyFilterOptions = useMemo(() => {
    return companies.map((company) : SelectFilterOption => {
      const name = company.empresa ? company.empresa.trim() : "(Sin nombre de empresa)";
      return  {value: name, label: `${name} (${company.cantidad_pozos} pozos)`}
    });
  }, [companies]);

  const duplicatedCompanies = comparisonFilters.empresa_1 && comparisonFilters.empresa_2 &&
      comparisonFilters.empresa_1.toLowerCase().trim() === comparisonFilters.empresa_2.toLowerCase().trim();


  return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Análisis de Empresas y Producción</h2>

        {/* Bar Chart Section */}
        <div style={styles.pieChartSection}>
          <div style={styles.chartControls}>
            <label style={styles.sliderLabel}>
              Número de empresas: <strong>{maxCompanies}</strong>
            </label>
            <input
                type="range"
                min="3"
                max="15"
                value={maxCompanies}
                onChange={(e) => setMaxCompanies(Number(e.target.value))}
                style={styles.slider}
            />
          </div>
          <CompaniesBarChart
              companies={companies}
              title={`Top ${maxCompanies} Empresas por Cantidad de Pozos`}
              maxCompanies={maxCompanies}
          />
        </div>

        <div style={styles.divider} />
        <UnitTabs onChange={setUnit} currentUnit={unit}/>
        <h3 style={styles.subHeading}>Análisis de Producción por Empresa</h3>

        <div style={styles.filtersContainer}>
          <SelectFilter value={filters.empresa || ""}
                        onSelect={updateProductionFilters}
                        filterName="empresa"
                        options={companyFilterOptions}
                        inputLabel="Empresa"
                        defaultOptionLabel="Seleccione una empresa"/>

          <div style={styles.dateRangeContainer}>
            <SelectFilter value={filters.inicio_anio || ""}
                          onSelect={updateProductionFilters}
                          filterName="inicio_anio"
                          inputLabel="Año de inicio"
                          options={YEARS}/>

            <SelectFilter value={filters.inicio_mes || ""}
                          onSelect={updateProductionFilters}
                          filterName="inicio_mes"
                          disabled={!filters.inicio_anio}
                          defaultOptionLabel="Todos"
                          inputLabel="Mes de inicio"
                          options={MONTHS}/>

            <SelectFilter value={filters.fin_anio || ""}
                          onSelect={updateProductionFilters}
                          filterName="fin_anio"
                          inputLabel="Año de fin"
                          options={YEARS}/>

            <SelectFilter value={filters.fin_mes || ""}
                          onSelect={updateProductionFilters}
                          filterName="fin_mes"
                          disabled={!filters.fin_anio}
                          defaultOptionLabel="Todos"
                          inputLabel="Mes de fin"
                          options={MONTHS}/>
          </div>
        </div>

        {errorCompanies && (
            <div style={styles.error}>Error al cargar empresas: {errorCompanies}</div>
        )}

        {errorProduction && (
            <div style={styles.error}>Error al cargar datos de producción: {errorProduction}</div>
        )}

        {!productionData && (
            <div style={styles.placeholder}>
              <p>Seleccione una empresa y un rango de fechas para ver las métricas de producción</p>
            </div>
        )}

        {loadingProduction && (
            <div style={styles.loading}>
              <p>Cargando datos de producción...</p>
            </div>
        )}

        {productionData && !loadingProduction && (
            <div style={styles.chartsContainer}>
              <ProductionBarChart 
                data={totalChartData} 
                title="Producción Total" 
                empresa={filters.empresa}
                fechaInicio={filters.inicio_anio && filters.inicio_mes ? `${filters.inicio_anio}-${filters.inicio_mes.toString().padStart(2, '0')}` : filters.inicio_anio?.toString()}
                fechaFin={filters.fin_anio && filters.fin_mes ? `${filters.fin_anio}-${filters.fin_mes.toString().padStart(2, '0')}` : filters.fin_anio?.toString()}
              />
              <ProductionBarChart 
                data={avgChartData} 
                title="Producción Promedio" 
                empresa={filters.empresa}
                fechaInicio={filters.inicio_anio && filters.inicio_mes ? `${filters.inicio_anio}-${filters.inicio_mes.toString().padStart(2, '0')}` : filters.inicio_anio?.toString()}
                fechaFin={filters.fin_anio && filters.fin_mes ? `${filters.fin_anio}-${filters.fin_mes.toString().padStart(2, '0')}` : filters.fin_anio?.toString()}
              />
            </div>
        )}

        <div style={styles.divider} />

        <CompanyComparisonPanel
            companies={companyFilterOptions}
            loadingCompanies={loadingCompanies}
            filters={comparisonFilters}
            updateFilters={updateComparisonFilters}/>

        {duplicatedCompanies && (
            <div style={styles.error}>Por favor, elegí dos empresas diferentes para comparar.</div>
        )}

        {errorComparison && (
            <div style={styles.error}>Error al comparar empresas: {errorComparison}</div>
        )}

        {!comparisonData && !duplicatedCompanies && (
            <div style={styles.placeholder}>
              <p>Seleccione dos empresas para comparar su producción</p>
            </div>
        )}

        {loadingComparison && (
            <div style={styles.loading}>
              <p>Cargando comparación...</p>
            </div>
        )}

        {comparisonData && !loadingComparison && (
            <CompanyComparisonCharts 
              companies={comparisonData.companies} 
              unit={unit}
              fechaInicio={comparisonFilters.inicio_anio && comparisonFilters.inicio_mes ? `${comparisonFilters.inicio_anio}-${comparisonFilters.inicio_mes.toString().padStart(2, '0')}` : comparisonFilters.inicio_anio?.toString()}
              fechaFin={comparisonFilters.fin_anio && comparisonFilters.fin_mes ? `${comparisonFilters.fin_anio}-${comparisonFilters.fin_mes.toString().padStart(2, '0')}` : comparisonFilters.fin_anio?.toString()}
            />
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
    fontSize: 28,
    fontWeight: 700,
    color: colors.text,
    margin: 0,
  } as React.CSSProperties,
  subHeading: {
    fontSize: 22,
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  } as React.CSSProperties,
  pieChartSection: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  } as React.CSSProperties,
  chartControls: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: "16px 24px",
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 16,
  } as React.CSSProperties,
  sliderLabel: {
    fontSize: 14,
    color: "#374151",
    minWidth: 180,
  } as React.CSSProperties,
  slider: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    outline: "none",
    opacity: 0.9,
    cursor: "pointer",
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
  divider: {
    height: 1,
    backgroundColor: colors.panelBorder,
    margin: "24px 0",
  } as React.CSSProperties,
} as const;
