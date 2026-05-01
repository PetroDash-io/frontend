import React from "react";
import {colors} from "@/utils/constants";
import {ComparisonFilters} from "@/app/types";
import {SelectFilter, SelectFilterOption} from "@/components/common/SelectFilter";
import {YearMonthRangeFilters} from "@/components/common/YearMonthRangeFilters";

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
      <div style={styles.filtersContainer}>
        <div style={styles.cardHeader}>
          <span className="card-label">Comparación</span>
          <h3 style={styles.subheading}>Comparación entre Empresas</h3>
        </div>

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
          <YearMonthRangeFilters
            onSelect={updateFilters}
            startYearValue={filters.inicio_anio || ""}
            startMonthValue={filters.inicio_mes || ""}
            endYearValue={filters.fin_anio || ""}
            endMonthValue={filters.fin_mes || ""}
          />
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
    padding: 24,
    backgroundColor: colors.filtersBg,
    borderRadius: 12,
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingBottom: 12,
    borderBottom: "1px solid var(--color-border-subtle)",
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
