import {colors, PRODUCTION_TYPES} from "@/utils/constants";

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";

import {convertValueToUnit, UNITS} from "@/utils/units";
import {useUnit} from "@/hooks/useUnit";
import {UnitTabs} from "@/components/common/UnitTabs";
import React, {useMemo} from "react";

  
interface CurveDataPoint {
  date: string;
  oil: number | null;
  gas: number | null;
  water: number | null;
    cumulative_oil?: number | null;
    cumulative_water?: number | null;
    cumulative_gas?: number | null;
  water_injection?: number | null;
  gas_injection?: number | null;
  co2_injection?: number | null;
}


interface CurveChartProps {
    data: CurveDataPoint[] | null;
    eur?: number | null;
}

export function TimeSeriesChart({data, eur}: CurveChartProps) {
    const {unit, setUnit} = useUnit();

    const convertedData = useMemo(() => {
        if (!data) return [];

        return data.map(row => ({
            ...row,
            oil: row.oil != null ? convertValueToUnit(row.oil, unit) : null,
            water: row.water != null ? convertValueToUnit(row.water, unit) : null,
            gas: row.gas ?? null,
            cumulative_oil: row.cumulative_oil != null ? convertValueToUnit(row.cumulative_oil, unit) : null,
            cumulative_water: row.cumulative_water != null ? convertValueToUnit(row.cumulative_water, unit) : null,
            cumulative_gas: row.cumulative_gas ?? null,
            water_injection: row.water_injection != null ? convertValueToUnit(row.water_injection, unit) : null,
            gas_injection: row.gas_injection ?? null,
            co2_injection: row.co2_injection ?? null,
        }));
    }, [data, unit]);

    const hasCumulativeProduction = convertedData.some(
        (row) => row.cumulative_oil != null || row.cumulative_water != null || row.cumulative_gas != null
    );

    if (!data || data.length === 0) {
        return (
            <div style={styles.curveChartWrapper}>
                <p style={styles.emptyDataMessage}>No hay datos de producción disponibles para este pozo.</p>
            </div>
        );
    }



    const yAxisTickFormatter = (value: number) => {
        return unit === UNITS.bbl ? value.toFixed(0) : value.toFixed(1)
    }

        const eurValue = typeof eur === "number" ? convertValueToUnit(eur, unit) : null;
        const formattedEur = eurValue != null
            ? eurValue.toLocaleString("es-AR", { maximumFractionDigits: 2 })
            : null;

    const tooltipTextFormatter = (value?: number, name?: string)  => {
        if (name === PRODUCTION_TYPES.gas.name) {
            return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, PRODUCTION_TYPES.gas.label];
        }

        if (name === PRODUCTION_TYPES.oil.name) {
            return [`${Number(value).toFixed(2)} ${unit}`, PRODUCTION_TYPES.oil.label];
        }

        if (name === PRODUCTION_TYPES.water.name) {
            return [`${Number(value).toFixed(2)} ${unit}`, PRODUCTION_TYPES.water.label];
        }

        if (name === "Inyección Agua") {
            return [`${Number(value).toFixed(2)} ${unit}`, "Inyección Agua"];
        }

        if (name === "Inyección Gas") {
            return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, "Inyección Gas"];
        }

        if (name === "Inyección CO2") {
            return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, "Inyección CO2"];
        }

        return value;
    }

    const cumulativeTooltipFormatter = (value?: number, name?: string) => {
        if (value == null) return ["-", "Producción acumulada"];

        const label = typeof name === "string" ? name : "Producción acumulada";

        if (label.includes("Gas")) {
            return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, "Gas acumulado"];
        }

        if (label.includes("Agua")) {
            return [`${Number(value).toFixed(2)} ${unit}`, "Agua acumulada"];
        }

        return [`${Number(value).toFixed(2)} ${unit}`, "Petróleo acumulado"];
    }

    return (
        <div style={styles.curveChartWrapper}>
           <UnitTabs onChange={setUnit} currentUnit={unit}/>

            <div style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={convertedData} margin={{ top: 40, right: 20, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis tickFormatter={yAxisTickFormatter}/>
                        <Tooltip formatter={tooltipTextFormatter}/>
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ color: colors.textLight, fontSize: 12, top: -14 }}
                        />
                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.oil.name}
                            name={`${PRODUCTION_TYPES.oil.label} (${unit})`}
                            stroke={PRODUCTION_TYPES.oil.defaultColor}
                            dot={false}/>

                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.gas.name}
                            name={`${PRODUCTION_TYPES.gas.label} (${UNITS.mm3})`}
                            stroke={PRODUCTION_TYPES.gas.defaultColor}
                            dot={false}/>
                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.water.name}
                            name={`${PRODUCTION_TYPES.water.label} (${unit})`}
                            stroke={PRODUCTION_TYPES.water.defaultColor}
                            dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {hasCumulativeProduction && (
              <div style={{ height: 340 }}>
                                <div style={styles.cumulativeHeader}>
                                    <h4 style={styles.cumulativeTitle}>Producción acumulada</h4>
                                    {formattedEur && (
                                        <div style={styles.eurBadge}>EUR: {formattedEur} {unit}</div>
                                    )}
                                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={convertedData} margin={{ top: 40, right: 20, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis tickFormatter={yAxisTickFormatter}/>
                        <Tooltip formatter={cumulativeTooltipFormatter}/>
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ color: colors.textLight, fontSize: 12, top: -14 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="cumulative_oil"
                            name={`Petróleo acumulado (${unit})`}
                            stroke={colors.oil}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="cumulative_water"
                            name={`Agua acumulada (${unit})`}
                            stroke={colors.water}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="cumulative_gas"
                            name={`Gas acumulado (${UNITS.mm3})`}
                            stroke={colors.gas}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={{ height: 340 }}>
                <h4 style={{ margin: "16px 0 8px", color: "#F3EEE6" }}>Progresión de inyecciones</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={convertedData} margin={{ top: 40, right: 20, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis tickFormatter={yAxisTickFormatter}/>
                        <Tooltip formatter={tooltipTextFormatter}/>
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ color: colors.textLight, fontSize: 12, top: -14 }}
                        />

                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.water_injection.name}
                            name={`${PRODUCTION_TYPES.water_injection.label} (${unit})`}
                            stroke={PRODUCTION_TYPES.water_injection.defaultColor}
                            dot
                        />

                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.gas_injection.name}
                            name={`${PRODUCTION_TYPES.gas_injection.label} (${UNITS.mm3})`}
                            stroke={PRODUCTION_TYPES.gas_injection.defaultColor}
                            dot
                        />

                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.co2_injection.name}
                            name={`${PRODUCTION_TYPES.co2_injection.label} (${UNITS.mm3})`}
                            stroke={PRODUCTION_TYPES.co2_injection.defaultColor}
                            dot
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const styles = {
    curveChartWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        color: colors.textLight,
        marginTop: 4,
        padding: 8,
        overflow: "visible",
    } as React.CSSProperties,
    cumulativeHeader: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        margin: "16px 0 8px",
    } as React.CSSProperties,
    cumulativeTitle: {
        margin: 0,
        color: "#F3EEE6",
    } as React.CSSProperties,
    eurBadge: {
        borderRadius: 999,
        padding: "6px 12px",
        backgroundColor: colors.oil,
        color: "#F3EEE6",
        fontSize: 12,
        fontWeight: 600,
    } as React.CSSProperties,
    emptyDataMessage: {
        padding: 20,
        textAlign: "center",
    } as React.CSSProperties,
};
