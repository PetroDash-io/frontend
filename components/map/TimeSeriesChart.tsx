import {colors, PRODUCTION_TYPES} from "@/utils/constants";

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis,} from "recharts";

import {convertValueToUnit, UNITS} from "@/utils/units";
import {useUnit} from "@/hooks/useUnit";
import {UnitTabs} from "@/components/common/UnitTabs";
import React, {useMemo} from "react";

  
interface CurveDataPoint {
  date: string;
  oil: number | null;
  gas: number | null;
  water: number | null;
  water_inyection?: number | null;
  gas_inyection?: number | null;
  co2_inyection?: number | null;
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
            oil: row.oil != null ? convertValueToUnit(row.oil, unit) : null,
            water: row.water != null ? convertValueToUnit(row.water, unit) : null,
            gas: row.gas ?? null,
            water_inyection: row.water_inyection != null ? convertValueToUnit(row.water_inyection, unit) : null,
            gas_inyection: row.gas_inyection ?? null,
            co2_inyection: row.co2_inyection ?? null,
        }));
    }, [data, unit]);

    if (!data || data.length === 0) {
        return (
            <div style={styles.curveChartWrapper}>
                <p style={styles.emptyDataMessage}>No hay datos de producción disponibles para este pozo.</p>
            </div>
        );
    }

    const injectionMarkerData = useMemo(() => {
    if (!convertedData || convertedData.length === 0) return {
      water: [],
      gas: [],
      co2: [],
    };

    const result = {
      water: [] as Array<{date: string; value: number}>,
      gas: [] as Array<{date: string; value: number}>,
      co2: [] as Array<{date: string; value: number}>,
    };

    convertedData.forEach((row, index) => {
      const prev = index > 0 ? convertedData[index - 1] : null;

      const currentWater = row.water_inyection ?? 0;
      const prevWater = prev?.water_inyection ?? 0;
      if (currentWater !== 0 && currentWater !== prevWater) {
        result.water.push({date: row.date, value: currentWater});
      }

      const currentGas = row.gas_inyection ?? 0;
      const prevGas = prev?.gas_inyection ?? 0;
      if (currentGas !== 0 && currentGas !== prevGas) {
        result.gas.push({date: row.date, value: currentGas});
      }

      const currentCo2 = row.co2_inyection ?? 0;
      const prevCo2 = prev?.co2_inyection ?? 0;
      if (currentCo2 !== 0 && currentCo2 !== prevCo2) {
        result.co2.push({date: row.date, value: currentCo2});
      }
    });

    return result;
  }, [convertedData]);

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
                            dataKey={PRODUCTION_TYPES.water_inyection.name}
                            name={`${PRODUCTION_TYPES.water_inyection.label} (${unit})`}
                            stroke={PRODUCTION_TYPES.water_inyection.defaultColor}
                            dot
                        />

                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.gas_inyection.name}
                            name={`${PRODUCTION_TYPES.gas_inyection.label} (${UNITS.mm3})`}
                            stroke={PRODUCTION_TYPES.gas_inyection.defaultColor}
                            dot
                        />

                        <Line
                            type="monotone"
                            dataKey={PRODUCTION_TYPES.co2_inyection.name}
                            name={`${PRODUCTION_TYPES.co2_inyection.label} (${UNITS.mm3})`}
                            stroke={PRODUCTION_TYPES.co2_inyection.defaultColor}
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
    emptyDataMessage: {
        padding: 20,
        textAlign: "center",
    } as React.CSSProperties,
};
