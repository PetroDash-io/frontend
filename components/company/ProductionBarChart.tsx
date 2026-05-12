import React from "react";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { exportMultipleSheetsToExcel } from "@/utils/excel";

interface ProductionBarChartData {
  name: string;
  oil: number;
  water: number;
  gas: number;
}

interface ProductionBarChartProps {
  data: ProductionBarChartData[];
  title: string;
  empresa?: string;
  fechaInicio?: string;
  fechaFin?: string;
    unit?: string;
    watershed?: string;
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

const formatTooltip = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return value.toLocaleString('es-AR', { maximumFractionDigits: 2 });
  }
  return value;
};

export function ProductionBarChart({
  data,
  title,
  empresa,
  fechaInicio,
  fechaFin,
  unit,
  watershed,
}: ProductionBarChartProps) {
    const handleDownloadExcel = () => {
        const unitLabel = unit || "m³";
        const unitSlug = unitLabel === "m³" ? "m3" : unitLabel.toLowerCase();
        const watershedSlug = watershed
          ? watershed.replace(/[^a-zA-Z0-9]/g, "-")
          : "";

        const dataToExport = data.map((item) => ({
            Periodo: item.name,
            [`Petróleo (${unitLabel})`]: item.oil,
            [`Gas (${unitLabel})`]: item.gas,
            [`Agua (${unitLabel})`]: item.water,
        }));

        const today = new Date().toISOString().split('T')[0];
        let fileName = 'produccion';
        if (empresa) fileName += `-${empresa.replace(/[^a-zA-Z0-9]/g, '-')}`;
        if (fechaInicio) fileName += `-desde-${fechaInicio}`;
        if (fechaFin) fileName += `-hasta-${fechaFin}`;
        if (watershedSlug) fileName += `-cuenca-${watershedSlug}`;
        fileName += `-unidad-${unitSlug}`;
        fileName += `-${today}`;

        const filterSheet = [
            { Filtro: "Empresa", Valor: empresa || "Sin empresa" },
            { Filtro: "Cuenca", Valor: watershed || "Todas" },
            { Filtro: "Tipo", Valor: title },
            { Filtro: "Fecha inicio", Valor: fechaInicio || "Todas" },
            { Filtro: "Fecha fin", Valor: fechaFin || "Todas" },
            { Filtro: "Unidad", Valor: unitLabel },
        ];

        exportMultipleSheetsToExcel(
            [
                { data: dataToExport, sheetName: "Producción" },
                { data: filterSheet, sheetName: "Filtros" },
            ],
            fileName
        );
    };

    return (
        <div style={styles.chartWrapper}>
            <div style={styles.cardHeader}>
                <span className="card-label">Producción por empresa</span>
            </div>
            <div style={styles.header}>
                <h3 style={styles.title}>{title}</h3>
                <button
                    onClick={handleDownloadExcel}
                    style={styles.downloadButton}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-brand-dark)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-brand-mid)";
                    }}
                >
                    📊 Descargar Excel
                </button>
            </div>
            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={styles.barChartMargins}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatYAxis} width={60} />
                        <Tooltip formatter={formatTooltip} />
                        <Legend />
                        <Bar dataKey={PRODUCTION_TYPES.oil.name} fill={colors.oil} name={PRODUCTION_TYPES.oil.label} />
                        <Bar dataKey={PRODUCTION_TYPES.gas.name} fill={colors.gas} name={PRODUCTION_TYPES.gas.label} />
                        <Bar dataKey={PRODUCTION_TYPES.water.name} fill={colors.water} name={PRODUCTION_TYPES.water.label} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const styles = {
    chartWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${colors.panelBorder}`,
        padding: 24,
        backgroundColor: "var(--color-bg-surface)",
        boxShadow: "var(--shadow-sm)",
    } as React.CSSProperties,
    cardHeader: {
        paddingBottom: 12,
        marginBottom: 4,
        borderBottom: "1px solid var(--color-border-subtle)",
    } as React.CSSProperties,
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    } as React.CSSProperties,
    title: {
        fontSize: 18,
        fontWeight: 600,
        color: colors.text,
        margin: 0,
    } as React.CSSProperties,
    downloadButton: {
        backgroundColor: "var(--color-brand-mid)",
        color: "var(--color-text-inverse)",
        border: "none",
        borderRadius: "8px",
        padding: "8px 14px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "background-color 0.2s",
    } as React.CSSProperties,
    barChartMargins: {
        top: 10,
        right: 20,
        left: 10,
        bottom: 10
    }
} as const;
