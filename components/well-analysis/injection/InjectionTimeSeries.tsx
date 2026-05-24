import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {UnitTabs} from "@/components/common/UnitTabs";
import {useUnit} from "@/hooks/useUnit";
import {convertValueToUnit} from "@/utils/units";

interface InjectionCurvePoint {
  date: string;
  water_injection?: number | null;
  gas_injection?: number | null;
  co2_injection?: number | null;
}

export function InjectionTimeSeries({data}: {data: InjectionCurvePoint[]}) {
  const {unit, setUnit} = useUnit();

  const convertedData = data.map((row) => ({
    ...row,
    water_injection: row.water_injection != null ? convertValueToUnit(row.water_injection, unit) : null,
    gas_injection: row.gas_injection ?? null,
    co2_injection: row.co2_injection ?? null,
  }));

  const tooltipFormatter = (value?: number, name?: string) => {
    if (name === "gas_injection") return [`${Number(value).toFixed(2)} Mm³`, "Inyección Gas"];
    const unitLabel = unit === "bbl" ? "BBL" : "m³";
    if (name === "water_injection") return [`${Number(value).toFixed(2)} ${unitLabel}`, "Inyección Agua"];
    if (name === "co2_injection") return [`${Number(value).toFixed(2)} ${unitLabel}`, "Inyección CO2"];
  };

  return (
    <div className="time-series-wrapper">
      <div className="time-series-controls-row">
        <UnitTabs onChange={setUnit} currentUnit={unit}/>
      </div>

      <div style={{height: 320}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={convertedData} margin={{top: 10, right: 20, left: 0, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={18} />
            <YAxis tickFormatter={(v) => (unit === "bbl" ? v.toFixed(0) : v.toFixed(1))} />
            <Tooltip formatter={tooltipFormatter}/>
            <Legend />

            <Line type="monotone" dataKey="water_injection" name={`Inyección Agua (${unit === "bbl" ? "BBL" : "m³"})`} stroke="var(--color-inj-water)" dot={false} />
            <Line type="monotone" dataKey="gas_injection" name="Inyección Gas (Mm³)" stroke="var(--color-inj-gas)" dot={false} />
            <Line type="monotone" dataKey="co2_injection" name="Inyección CO2" stroke="var(--color-inj-co2)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

