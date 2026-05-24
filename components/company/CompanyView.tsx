import React, {useEffect, useMemo, useState} from "react";
import {colors, CONTENT_MAX_WIDTH, WATERSHED_OPTIONS} from "@/utils/constants";
import {useCompanies} from "@/hooks/useCompanies";
import {useProductionAggregates} from "@/hooks/useProductionAggregates";
import {useCompanyComparison} from "@/hooks/useCompanyComparison";
import {ProductionBarChart} from "@/components/company/ProductionBarChart";
import {CompanyComparisonPanel} from "@/components/company/CompanyComparisonPanel";
import {CompanyComparisonCharts} from "@/components/company/CompanyComparisonCharts";
import {CompaniesBarChart} from "@/components/common/CompaniesBarChart";
import {ComparisonFilters, ProductionAggregatesFilters} from "@/app/types";
import {UnitTabs} from "@/components/common/UnitTabs";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";
import {useUnit} from "@/hooks/useUnit";
import {convertValueToUnit} from "@/utils/units";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
import {YearMonthRangeFilters} from "@/components/common/YearMonthRangeFilters";

export function CompanyView() {
  const [watershed, setWatershed] = useState<string>("NEUQUINA");
  const [filters, setFilters] = useState<Partial<ProductionAggregatesFilters>>({});
  const [comparisonFilters, setComparisonFilters] = useState<Partial<ComparisonFilters>>({});
  const [maxCompanies, setMaxCompanies] = useState<number>(7);

  const { companies, loading: loadingCompanies, error: errorCompanies } = useCompanies(undefined, watershed);
  const { data: productionData, loading: loadingProduction, error: errorProduction } = useProductionAggregates({...filters, watershed});
  const { data: comparisonData, loading: loadingComparison, error: errorComparison } = useCompanyComparison({...comparisonFilters, watershed});

  const {unit, setUnit} = useUnit();
  const errorMessage = errorCompanies || errorProduction || errorComparison || null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

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

  const updateWatershedFilter = (filterName: string, value: unknown) => {
    setWatershed(String(value))
  }

  const parseFilterValue = (filterName: string, value: unknown) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    if (filterName.endsWith("_anio") || filterName.endsWith("_mes")) {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : undefined;
    }

    return String(value);
  };

  const updateProductionFilters = (filterName: string, value: unknown) => {
    setFilters((previousValues) => {
      const parsedValue = parseFilterValue(filterName, value);
      if (parsedValue === undefined) {
        const nextValues = {...previousValues};
        delete nextValues[filterName as keyof ProductionAggregatesFilters];
        return nextValues;
      }
      return {...previousValues, [filterName]: parsedValue};
    });
  }

  const updateComparisonFilters = (filterName: string, value: unknown) => {
    setComparisonFilters((previousValues) => {
      const parsedValue = parseFilterValue(filterName, value);
      if (parsedValue === undefined) {
        const nextValues = {...previousValues};
        delete nextValues[filterName as keyof ComparisonFilters];
        return nextValues;
      }
      return {...previousValues, [filterName]: parsedValue};
    });
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
        <div style={styles.filtersContainer}>
          <div style={styles.cardHeader}>
            <span className="card-label">Cuenca</span>
          </div>
          <SelectFilter value={watershed}
                        onSelect={updateWatershedFilter}
                        filterName="watershed"
                        options={WATERSHED_OPTIONS}
                        inputLabel="Cuenca"/>
        </div>
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
              watershed={watershed}
          />
        </div>

        <div style={styles.divider} />
        <UnitTabs onChange={setUnit} currentUnit={unit}/>
        <h3 style={styles.subHeading}>Análisis de Producción por Empresa</h3>

        <div style={styles.filtersContainer}>
          <div style={styles.cardHeader}>
            <span className="card-label">Filtros</span>
          </div>
          <SelectFilter value={filters.empresa || ""}
                        onSelect={updateProductionFilters}
                        filterName="empresa"
                        options={companyFilterOptions}
                        inputLabel="Empresa"
                        defaultOptionLabel="Seleccione una empresa"/>
          <span style={styles.filterSectionLabel}>Rango de fechas</span>
          <div style={styles.dateRangeContainer}>
            <YearMonthRangeFilters
              onSelect={updateProductionFilters}
              startYearValue={filters.inicio_anio || ""}
              startMonthValue={filters.inicio_mes || ""}
              endYearValue={filters.fin_anio || ""}
              endMonthValue={filters.fin_mes || ""}
            />
          </div>
        </div>

        {errorMessage && (
            <InlineMessage message={errorMessage || "Unexpected error"} variant="error"/>
        )}

        {!productionData && (
            <InlineMessage message="Seleccione una empresa y un rango de fechas para ver las métricas de producción." />
        )}

        {loadingProduction && (
            <LoadingState/>
        )}

        {productionData && !loadingProduction && (
            <div style={styles.chartsContainer}>
              <ProductionBarChart 
                data={totalChartData} 
                title="Producción Total" 
                empresa={filters.empresa}
                fechaInicio={filters.inicio_anio && filters.inicio_mes ? `${filters.inicio_anio}-${filters.inicio_mes.toString().padStart(2, '0')}` : filters.inicio_anio?.toString()}
                fechaFin={filters.fin_anio && filters.fin_mes ? `${filters.fin_anio}-${filters.fin_mes.toString().padStart(2, '0')}` : filters.fin_anio?.toString()}
                unit={unit}
                watershed={watershed}
              />
              <ProductionBarChart 
                data={avgChartData} 
                title="Producción Promedio" 
                empresa={filters.empresa}
                fechaInicio={filters.inicio_anio && filters.inicio_mes ? `${filters.inicio_anio}-${filters.inicio_mes.toString().padStart(2, '0')}` : filters.inicio_anio?.toString()}
                fechaFin={filters.fin_anio && filters.fin_mes ? `${filters.fin_anio}-${filters.fin_mes.toString().padStart(2, '0')}` : filters.fin_anio?.toString()}
                unit={unit}
                watershed={watershed}
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
            <InlineMessage message="Por favor, elegí dos empresas diferentes para comparar." variant="warning"/>
        )}

        {!comparisonData && !duplicatedCompanies && (
            <InlineMessage message="Seleccione dos empresas para comparar su producción." />
        )}

        {loadingComparison && (
            <LoadingState/>
        )}

        {comparisonData && !loadingComparison && (
            <CompanyComparisonCharts 
              companies={comparisonData.companies} 
              unit={unit}
              fechaInicio={comparisonFilters.inicio_anio && comparisonFilters.inicio_mes ? `${comparisonFilters.inicio_anio}-${comparisonFilters.inicio_mes.toString().padStart(2, '0')}` : comparisonFilters.inicio_anio?.toString()}
              fechaFin={comparisonFilters.fin_anio && comparisonFilters.fin_mes ? `${comparisonFilters.fin_anio}-${comparisonFilters.fin_mes.toString().padStart(2, '0')}` : comparisonFilters.fin_anio?.toString()}
              watershed={watershed}
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
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    margin: "0 auto",
    boxSizing: "border-box",
    minWidth: 0,
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
    backgroundColor: "var(--color-bg-surface)",
    borderRadius: "var(--radius-xl)",
    padding: "24px",
    marginBottom: 16,
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--color-border-subtle)",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  } as React.CSSProperties,
  sliderLabel: {
    fontSize: 14,
    color: "var(--color-text-secondary)",
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
    padding: 16,
    backgroundColor: colors.filtersBg,
    borderRadius: "var(--radius-xl)",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  cardHeader: {
    paddingBottom: 10,
    marginBottom: 4,
    borderBottom: "1px solid var(--color-border-subtle)",
  } as React.CSSProperties,
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  dateRangeContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  } as React.CSSProperties,
  input: {
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${colors.secondary}`,
    backgroundColor: "var(--color-bg-surface)",
    fontSize: 14,
    color: colors.text,
  } as React.CSSProperties,
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
    gap: 24,
  } as React.CSSProperties,
  placeholder: {
    padding: 40,
    textAlign: "center",
    backgroundColor: "var(--color-bg-surface)",
    borderRadius: "var(--radius-xl)",
    border: `1px solid ${colors.panelBorder}`,
    color: colors.text,
  } as React.CSSProperties,
  loading: {
    padding: 40,
    textAlign: "center",
    backgroundColor: "var(--color-bg-surface)",
    borderRadius: "var(--radius-xl)",
    border: `1px solid ${colors.panelBorder}`,
    color: colors.text,
  } as React.CSSProperties,
  error: {
    padding: 16,
    backgroundColor: "rgba(192, 57, 43, 0.08)",
    color: "var(--color-error)",
    borderRadius: 8,
    fontSize: 14,
  } as React.CSSProperties,
  divider: {
    height: 1,
    backgroundColor: colors.panelBorder,
    margin: "24px 0",
  } as React.CSSProperties,
} as const;

export function CompanyIcon({width = 18, height = 18}: {width?: number; height?: number}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22V7h16v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
