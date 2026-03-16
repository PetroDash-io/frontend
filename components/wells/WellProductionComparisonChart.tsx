import React, {useEffect, useState} from "react";
import {colors, MONTHS, YEARS} from "@/utils/constants";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useWellProductionComparison } from "@/hooks/useWellProductionComparison";
import { WellProductionComparisonFilters } from "@/app/types";
import {SelectFilter} from "@/components/common/SelectFilter";
import { exportMultipleSheetsToExcel } from "@/utils/excel";
import { toast } from "react-toastify";
import { LoadingState } from "@/components/common/LoadingState";
import { InlineMessage } from "@/components/common/InlineMessage";

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

export function WellProductionComparisonChart() {
  const [wellId, setWellId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Partial<WellProductionComparisonFilters>>({median_by: []});
  const { data, loading, error } = useWellProductionComparison(wellId, filters);
  const errorMessage = error || null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

  const handleWellIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setWellId(null);
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setWellId(parsed);
      } else {
        setWellId(null);
      }
    }
  };

  const handleMedianByChange = (value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentMedianBy = prev.median_by || [];
      if (checked) {
        return { ...prev, median_by: [...currentMedianBy, value] };
      } else {
        return { ...prev, median_by: currentMedianBy.filter((v) => v !== value) };
      }
    });
  };

  const updateFilters = (filterName: string, value: unknown) => {
    setFilters((previousValues) => ({...previousValues, [filterName]: value}));
  }

  // Preparar datos para los gráficos
  const oilData = data?.data?.[0]
    ? [
        { name: "Pozo", value: data.data[0].oil.total },
        { name: "Mediana", value: data.data[0].oil.median },
      ]
    : [];

  const gasData = data?.data?.[0]
    ? [
        { name: "Pozo", value: data.data[0].gas.total },
        { name: "Mediana", value: data.data[0].gas.median },
      ]
    : [];

  const waterData = data?.data?.[0]
    ? [
        { name: "Pozo", value: data.data[0].water.total },
        { name: "Mediana", value: data.data[0].water.median },
      ]
    : [];

  const handleDownloadExcel = () => {
    if (!data || !data.data || data.data.length === 0) return;

    const dataToExport = [
      {
        Recurso: "Petróleo",
        Pozo: data.data[0].oil.total,
        Mediana: data.data[0].oil.median,
        Unidad: "m³",
      },
      {
        Recurso: "Gas",
        Pozo: data.data[0].gas.total,
        Mediana: data.data[0].gas.median,
        Unidad: "Mm³",
      },
      {
        Recurso: "Agua",
        Pozo: data.data[0].water.total,
        Mediana: data.data[0].water.median,
        Unidad: "m³",
      },
    ];

    const today = new Date().toISOString().split('T')[0];
    let fileName = `pozo-${wellId}`;
    
    if (data.start_year && data.start_month && data.end_year && data.end_month) {
      fileName += `-${data.start_year}-${data.start_month.toString().padStart(2, '0')}-a-${data.end_year}-${data.end_month.toString().padStart(2, '0')}`;
    }
    
    if (filters.median_by && filters.median_by.length > 0) {
      fileName += `-mediana-por-${filters.median_by.join('-')}`;
    }
    
    fileName += `-${today}`;

    exportMultipleSheetsToExcel(
      [
        {
          data: dataToExport,
          sheetName: "Comparación",
        },
      ],
      fileName
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.mainTitle}>Análisis de Producción por Pozo</h2>
        {data && data.data && data.data.length > 0 && (
          <button
            onClick={handleDownloadExcel}
            style={styles.downloadButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2F5A3F";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#3F6B4F";
            }}
          >
            📊 Descargar Excel
          </button>
        )}
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.filterRow}>
          <label style={styles.label}>
            ID del Pozo:
            <input
              type="number"
              value={wellId || ""}
              onChange={handleWellIdChange}
              placeholder="Ingrese ID del pozo"
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.filterRow}>
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

        <div style={styles.filterRow}>
          <label style={styles.checkboxLabel}>
            Filtrar mediana por:
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.median_by?.includes("company") || false}
              onChange={(e) => handleMedianByChange("company", e.target.checked)}
            />
            Empresa
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.median_by?.includes("area") || false}
              onChange={(e) => handleMedianByChange("area", e.target.checked)}
            />
            Área
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.median_by?.includes("province") || false}
              onChange={(e) => handleMedianByChange("province", e.target.checked)}
            />
            Provincia
          </label>
        </div>
      </div>

      {loading && <LoadingState/>}
      {errorMessage && <InlineMessage message={errorMessage || "Unexpected error"} variant="error"/>}

      {data && data.data && data.data.length > 0 && (
        <div style={styles.infoContainer}>
          <p style={styles.info}>
            <strong>Pozo:</strong> {data.well_id} | <strong>Empresa:</strong> {data.company} |{" "}
            <strong>Área:</strong> {data.area} | <strong>Provincia:</strong> {data.province}
          </p>
          {data.start_year && data.start_month && data.end_year && data.end_month && (
            <p style={styles.info}>
              <strong>Período:</strong> {data.start_month}/{data.start_year} - {data.end_month}/{data.end_year}
            </p>
          )}
        </div>
      )}

      {data && data.data && data.data.length > 0 && (
        <div style={styles.chartsContainer}>
          <div style={styles.chartWrapper}>
            <h3 style={styles.chartTitle}>Producción de Petróleo</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={oilData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} width={60} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" name="Petróleo (m³)">
                  <Cell fill={colors.oil} />
                  <Cell fill={colors.oil} opacity={0.6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartWrapper}>
            <h3 style={styles.chartTitle}>Producción de Gas</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={gasData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} width={60} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" name="Gas (Mm³)">
                  <Cell fill={colors.gas} />
                  <Cell fill={colors.gas} opacity={0.6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartWrapper}>
            <h3 style={styles.chartTitle}>Producción de Agua</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={waterData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} width={60} />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" name="Agua (m³)">
                  <Cell fill={colors.water} />
                  <Cell fill={colors.water} opacity={0.6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!wellId && !loading && (
        <InlineMessage message="Ingrese un ID de pozo para ver el análisis de producción." />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    width: "100%",
    minHeight: "calc(100vh - 200px)",
  } as React.CSSProperties,
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  } as React.CSSProperties,
  mainTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: colors.primary,
    margin: 0,
  } as React.CSSProperties,
  downloadButton: {
    backgroundColor: "#3F6B4F",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background-color 0.2s",
  } as React.CSSProperties,
  filtersContainer: {
    backgroundColor: colors.filtersBg,
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: `1px solid ${colors.panelBorder}`,
  } as React.CSSProperties,
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
    flex: "1",
    minWidth: "150px",
  } as React.CSSProperties,
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
  } as React.CSSProperties,
  input: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: `1px solid ${colors.panelBorder}`,
    fontSize: "14px",
    minWidth: "120px",
  } as React.CSSProperties,
  select: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: `1px solid ${colors.panelBorder}`,
    fontSize: "14px",
    width: "100%",
    backgroundColor: "white",
    cursor: "pointer",
  } as React.CSSProperties,
  infoContainer: {
    backgroundColor: colors.filtersBg,
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: `1px solid ${colors.panelBorder}`,
  } as React.CSSProperties,
  info: {
    margin: "4px 0",
    fontSize: "14px",
    color: colors.text,
  } as React.CSSProperties,
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    width: "100%",
  } as React.CSSProperties,
  chartWrapper: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${colors.panelBorder}`,
  } as React.CSSProperties,
  chartTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: colors.primary,
    marginBottom: "16px",
    textAlign: "center",
  } as React.CSSProperties,
  message: {
    textAlign: "center",
    padding: "40px",
    fontSize: "16px",
    color: colors.text,
  } as React.CSSProperties,
  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    marginBottom: "20px",
  } as React.CSSProperties,
};
