"use client";

import React from "react";
import {colors, MONTHS, YEARS} from "@/utils/constants";
import {ComparisonFilters} from "@/app/types";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";

interface CompanyComparisonPanelProps {
  companies: SelectFilterOption[];
  loadingCompanies: boolean;
  filters: Partial<ComparisonFilters>;
  updateFilters: (filterName: string, value: string) => void;
}

export function CompanyComparisonPanel({
  companies,
  loadingCompanies,
  filters,
  updateFilters
}: CompanyComparisonPanelProps) {
  return (
    <div style={styles.container}>
      <h3 style={styles.subheading}>Comparación entre Empresas</h3>

      <div style={styles.filtersContainer}>
        <div style={styles.companiesRow}>
          <SelectFilter value={filters.empresa_1 || ""}
                        onSelect={updateFilters}
                        filterName="empresa_1"
                        options={companies}
                        inputLabel="Primera empresa"
                        disabled={loadingCompanies}
                        defaultOptionLabel="Seleccione una empresa"/>
          <SelectFilter value={filters.empresa_2 || ""}
                        onSelect={updateFilters}
                        filterName="empresa_2"
                        options={companies}
                        inputLabel="Segunda empresa"
                        disabled={loadingCompanies}
                        defaultOptionLabel="Seleccione una empresa"/>
        </div>

        <div style={styles.dateRangeContainer}>
          <SelectFilter value={filters.inicio_anio || ""}
                        onSelect={updateFilters}
                        filterName="inicio_anio"
                        defaultOptionLabel="Todos"
                        inputLabel="Año de inicio"
                        options={YEARS}/>

          <SelectFilter value={filters.inicio_mes || ""}
                        onSelect={updateFilters}
                        filterName="inicio_mes"
                        disabled={!filters.inicio_anio}
                        defaultOptionLabel="Todos"
                        inputLabel="Mes de inicio"
                        options={MONTHS}/>

          <SelectFilter value={filters.fin_anio || ""}
                        onSelect={updateFilters}
                        filterName="fin_anio"
                        defaultOptionLabel="Todos"
                        inputLabel="Año de fin"
                        options={YEARS}/>

          <SelectFilter value={filters.fin_mes || ""}
                        onSelect={updateFilters}
                        filterName="fin_mes"
                        disabled={!filters.fin_anio}
                        defaultOptionLabel="Todos"
                        inputLabel="Mes de fin"
                        options={MONTHS}/>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  } as React.CSSProperties,
  subheading: {
    fontSize: 20,
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
  companiesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 16,
  } as React.CSSProperties,
  dateRangeContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  } as React.CSSProperties
};
