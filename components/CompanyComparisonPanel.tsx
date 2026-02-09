"use client";

import React from "react";
import { colors } from "@/utils/constants";
import { Company } from "@/app/types";

interface CompanyComparisonPanelProps {
  empresas: Company[];
  cargandoEmpresas: boolean;
  empresa1: string;
  empresa2: string;
  inicioAnio: number | undefined;
  inicioMes: number | undefined;
  finAnio: number | undefined;
  finMes: number | undefined;
  onEmpresa1Change: (value: string) => void;
  onEmpresa2Change: (value: string) => void;
  onInicioAnioChange: (value: number | undefined) => void;
  onInicioMesChange: (value: number | undefined) => void;
  onFinAnioChange: (value: number | undefined) => void;
  onFinMesChange: (value: number | undefined) => void;
}

const startYear = 2013;
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i
);

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

interface CompanySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  empresas: Company[];
  disabled: boolean;
}

function CompanySelect({ label, value, onChange, empresas, disabled }: CompanySelectProps) {
  return (
    <div style={styles.filterGroup}>
      <label style={styles.label}>
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.select}
          disabled={disabled}
        >
          <option value="">Seleccione una empresa</option>
          {empresas.map((company, index) => (
            <option
              key={`${company.empresa}-${index}`}
              value={company.empresa}
            >
              {company.empresa && company.empresa.trim()
                ? company.empresa
                : "(Sin nombre de empresa)"}{" "}
              ({company.cantidad_pozos} pozos)
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

interface DateRangeFilterProps {
  inicioAnio: number | undefined;
  inicioMes: number | undefined;
  finAnio: number | undefined;
  finMes: number | undefined;
  onInicioAnioChange: (value: number | undefined) => void;
  onInicioMesChange: (value: number | undefined) => void;
  onFinAnioChange: (value: number | undefined) => void;
  onFinMesChange: (value: number | undefined) => void;
}

function DateRangeFilter({
  inicioAnio,
  inicioMes,
  finAnio,
  finMes,
  onInicioAnioChange,
  onInicioMesChange,
  onFinAnioChange,
  onFinMesChange,
}: DateRangeFilterProps) {
  return (
    <div style={styles.dateRangeContainer}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>
          Año inicio:
          <select
            value={inicioAnio || ""}
            onChange={(e) =>
              onInicioAnioChange(e.target.value ? Number(e.target.value) : undefined)
            }
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
            value={inicioMes || ""}
            onChange={(e) =>
              onInicioMesChange(e.target.value ? Number(e.target.value) : undefined)
            }
            style={styles.select}
            disabled={!inicioAnio}
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
            value={finAnio || ""}
            onChange={(e) =>
              onFinAnioChange(e.target.value ? Number(e.target.value) : undefined)
            }
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
            value={finMes || ""}
            onChange={(e) =>
              onFinMesChange(e.target.value ? Number(e.target.value) : undefined)
            }
            style={styles.select}
            disabled={!finAnio}
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
  );
}

export function CompanyComparisonPanel({
  empresas,
  cargandoEmpresas,
  empresa1,
  empresa2,
  inicioAnio,
  inicioMes,
  finAnio,
  finMes,
  onEmpresa1Change,
  onEmpresa2Change,
  onInicioAnioChange,
  onInicioMesChange,
  onFinAnioChange,
  onFinMesChange,
}: CompanyComparisonPanelProps) {
  return (
    <div style={styles.container}>
      <h3 style={styles.subheading}>Comparación entre Empresas</h3>

      <div style={styles.filtersContainer}>
        <div style={styles.companiesRow}>
          <CompanySelect
            label="Primera Empresa:"
            value={empresa1}
            onChange={onEmpresa1Change}
            empresas={empresas}
            disabled={cargandoEmpresas}
          />
          <CompanySelect
            label="Segunda Empresa:"
            value={empresa2}
            onChange={onEmpresa2Change}
            empresas={empresas}
            disabled={cargandoEmpresas}
          />
        </div>

        <DateRangeFilter
          inicioAnio={inicioAnio}
          inicioMes={inicioMes}
          finAnio={finAnio}
          finMes={finMes}
          onInicioAnioChange={onInicioAnioChange}
          onInicioMesChange={onInicioMesChange}
          onFinAnioChange={onFinAnioChange}
          onFinMesChange={onFinMesChange}
        />
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
} as const;
