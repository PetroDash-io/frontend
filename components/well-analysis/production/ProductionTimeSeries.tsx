import React from "react";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useUnit} from "@/hooks/useUnit";
import {UnitTabs} from "@/components/common/UnitTabs";
import {convertValueToUnit, UNITS} from "@/utils/units";

interface ProductionCurvePoint {
  date: string;
  oil: number | null;
  gas: number | null;
  water: number | null;
}

export function ProductionTimeSeries({data}: {data: ProductionCurvePoint[]}) {
  const {unit, setUnit} = useUnit();

  const convertedData = data.map((row) => ({
    ...row,
    oil: row.oil != null ? convertValueToUnit(row.oil, unit) : null,
    water: row.water != null ? convertValueToUnit(row.water, unit) : null,
    gas: row.gas ?? null,
  }));

  const tooltipTextFormatter = (value?: number, name?: string)  => {
    if (name?.includes(PRODUCTION_TYPES.gas.label)) {
      return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, PRODUCTION_TYPES.gas.label];
    }

    if (name?.includes(PRODUCTION_TYPES.oil.label)) {
      return [`${Number(value).toFixed(2)} ${unit}`, PRODUCTION_TYPES.oil.label];
    }

    if (name?.includes(PRODUCTION_TYPES.water.label)) {
      return [`${Number(value).toFixed(2)} ${unit}`, PRODUCTION_TYPES.water.label];
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.controlsRow}>
        <UnitTabs onChange={setUnit} currentUnit={unit}/>
      </div>

      <div style={{height: 320}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={convertedData} margin={{top: 10, right: 20, left: 0, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={18} />
            <YAxis tickFormatter={(v) => (unit === "bbl" ? v.toFixed(0) : v.toFixed(1))} />
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
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderRadius: "var(--radius-2xl)",
    border: `1px solid ${colors.panelBorder}`,
    backgroundColor: "var(--color-bg-surface)",
  } as React.CSSProperties,
  controlsRow: {
    display: "flex",
    gap: 12,
    padding: "12px 24px",
  } as React.CSSProperties,
};
