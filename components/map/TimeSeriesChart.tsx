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
}


interface CurveChartProps {
    data: CurveDataPoint[] | null;
}

export function TimeSeriesChart({data}: CurveChartProps) {
    const {unit, setUnit} = useUnit();

    const convertedData = useMemo(() => {
        if (!data) return [];

        return data.map(row => ({
            ...row,
            oil: convertValueToUnit(row.oil, unit),
            water: convertValueToUnit(row.water, unit),
            gas: row.gas, // Gas queda en miles de m³
        }));
    }, [data, unit]);

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

        return value;
    }

    return (
        <div style={styles.curveChartWrapper}>
           <UnitTabs onChange={setUnit} currentUnit={unit}/>

            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={convertedData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis tickFormatter={yAxisTickFormatter}/>
                        <Tooltip formatter={tooltipTextFormatter}/>
                        <Legend />
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
    } as React.CSSProperties,
    emptyDataMessage: {
        padding: 20,
        textAlign: "center",
    } as React.CSSProperties,
};
