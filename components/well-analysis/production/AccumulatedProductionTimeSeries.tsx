import React from "react";
import {colors, PRODUCTION_TYPES} from "@/utils/constants";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {UnitTabs} from "@/components/common/UnitTabs";
import {useUnit} from "@/hooks/useUnit";
import {convertValueToUnit, UNITS} from "@/utils/units";

interface AccumulatedCurvePoint {
  date: string;
  cumulative_oil_production?: number | null;
  cumulative_gas_production?: number | null;
  cumulative_water_production?: number | null;
}

export function AccumulatedProductionTimeSeries({data}: {data: AccumulatedCurvePoint[]}) {
  const {unit, setUnit} = useUnit();

  const convertedData = data.map((row) => ({
    ...row,
    cumulative_oil_production:
      row.cumulative_oil_production != null ? convertValueToUnit(row.cumulative_oil_production, unit) : null,
    cumulative_water_production:
      row.cumulative_water_production != null ? convertValueToUnit(row.cumulative_water_production, unit) : null,
    cumulative_gas_production: row.cumulative_gas_production ?? null,
  }));

  const tooltipFormatter = (value?: number, name?: string) => {
    if (name?.includes(PRODUCTION_TYPES.gas.label)) {
      return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, "Gas acumulado"];
    }

    if (name?.includes(PRODUCTION_TYPES.oil.label)) {
      return [`${Number(value).toFixed(2)} ${unit}`, "Petróleo acumulado"];
    }

    if (name?.includes(PRODUCTION_TYPES.water.label)) {
      return [`${Number(value).toFixed(2)} ${unit}`, "Agua acumulada"];
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.controlsRow}>
        <UnitTabs onChange={setUnit} currentUnit={unit} />
      </div>

      <div style={{height: 320}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={convertedData} margin={{top: 10, right: 20, left: 0, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={18} />
            <YAxis tickFormatter={(v) => (unit === "bbl" ? v.toFixed(0) : v.toFixed(1))} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />

            <Line
              type="monotone"
              dataKey="cumulative_oil_production"
              name={`Petróleo acumulado (${unit})`}
              stroke={colors.oil}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cumulative_gas_production"
              name={`Gas acumulado (${UNITS.mm3})`}
              stroke={colors.gas}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cumulative_water_production"
              name={`Agua acumulada (${unit})`}
              stroke={colors.water}
              dot={false}
            />
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
    borderRadius: 14,
    border: `1px solid ${colors.panelBorder}`,
    backgroundColor: "var(--color-bg-surface)",
  } as React.CSSProperties,
  controlsRow: {
    display: "flex",
    gap: 12,
    padding: "12px 24px",
  } as React.CSSProperties,
};
