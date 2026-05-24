import React, {useMemo, useState} from "react";
import {colors} from "@/utils/constants";
import {formatTooltip, formatYAxis} from "@/utils/formatters";
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell} from "recharts";
import {WellProductionComparisonFilters} from "@/app/types";
import {DateRangeValue} from "@/utils/dateRange";
import {useWellProductionComparison} from "@/hooks/useWellProductionComparison";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";

interface WellComparisonSectionProps {
  wellId: number;
  dateRange: DateRangeValue;
}


export function WellComparisonSection({wellId, dateRange}: WellComparisonSectionProps) {
  const [filters, setFilters] = useState<Partial<WellProductionComparisonFilters>>({median_by: []});

  const {data, loading, error} = useWellProductionComparison(wellId, filters, dateRange);

  const handleMedianByChange = (value: string, checked: boolean) => {
    setFilters((previous) => {
      const currentMedianBy = previous.median_by || [];
      if (checked) {
        return {...previous, median_by: [...currentMedianBy, value]};
      }
      return {...previous, median_by: currentMedianBy.filter((item) => item !== value)};
    });
  };

  const oilData = useMemo(() => {
    if (!data?.data?.[0]) return [];
    return [
      {name: "Pozo", value: data.data[0].oil.total},
      {name: "Mediana", value: data.data[0].oil.median},
    ];
  }, [data]);

  const gasData = useMemo(() => {
    if (!data?.data?.[0]) return [];
    return [
      {name: "Pozo", value: data.data[0].gas.total},
      {name: "Mediana", value: data.data[0].gas.median},
    ];
  }, [data]);

  const waterData = useMemo(() => {
    if (!data?.data?.[0]) return [];
    return [
      {name: "Pozo", value: data.data[0].water.total},
      {name: "Mediana", value: data.data[0].water.median},
    ];
  }, [data]);

  return (
    <>
      <div style={styles.filterRow}>
        <label style={styles.checkboxLabel}>Filtrar mediana por:</label>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.median_by?.includes("company") || false}
            onChange={(event) => handleMedianByChange("company", event.target.checked)}
          />
          Empresa
        </label>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.median_by?.includes("area") || false}
            onChange={(event) => handleMedianByChange("area", event.target.checked)}
          />
          Área
        </label>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.median_by?.includes("province") || false}
            onChange={(event) => handleMedianByChange("province", event.target.checked)}
          />
          Provincia
        </label>
      </div>

      {loading && <LoadingState />}
      {error && <InlineMessage message={error} variant="error" />}

      {!loading && !error && (!data?.data || data.data.length === 0) && (
        <InlineMessage
          message="Sin datos de comparación para el período seleccionado."
          variant="warning"
        />
      )}

      {!loading && !error && (
        <div style={styles.chartsContainer}>
          <div style={styles.chartWrapper}>
            <h3 style={styles.chartTitle}>Producción de Petróleo</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={oilData} margin={{top: 10, right: 20, left: 10, bottom: 10}}>
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
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={gasData} margin={{top: 10, right: 20, left: 10, bottom: 10}}>
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
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={waterData} margin={{top: 10, right: 20, left: 10, bottom: 10}}>
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
    </>
  );
}

const styles = {
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  } as React.CSSProperties,
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
  } as React.CSSProperties,
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
    gap: "20px",
    width: "100%",
  } as React.CSSProperties,
  chartWrapper: {
    backgroundColor: "var(--color-bg-surface)",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "var(--shadow-sm)",
    border: `1px solid ${colors.panelBorder}`,
  } as React.CSSProperties,
  chartTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: colors.primary,
    marginBottom: "16px",
    textAlign: "center",
  } as React.CSSProperties,
};
