import React, {useMemo} from "react";
import {ProductionResource, WellProductionAnomalyPeriod} from "@/components/well-analysis/anomalies/types";
import {UNITS} from "@/utils/units";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {PRODUCTION_TYPES} from "@/utils/constants";
import {buildAnomalyChartData} from "@/components/well-analysis/anomalies/data";
import {ProductionMonthly} from "@/app/types";
import {useUnit} from "@/hooks/useUnit";
import {UnitTabs} from "@/components/common/UnitTabs";

interface AnomaliesTimeSeriesProps {
  production: ProductionMonthly[] | null,
  anomalyPeriods: WellProductionAnomalyPeriod[],
  resource: ProductionResource,
}

export function AnomaliesTimeSeries({production, anomalyPeriods, resource}: AnomaliesTimeSeriesProps) {
  const {unit, setUnit} = useUnit();

  const chartData = useMemo(() => {
    const convertedAnomalyPeriods = new Set(
        anomalyPeriods.map(period => period.data_date.slice(0, 7))
    );
    return buildAnomalyChartData(production, resource, unit, convertedAnomalyPeriods);
  }, [production, resource, unit, anomalyPeriods]);

  const yAxisTickFormatter = (value: number) => {
    return unit === UNITS.bbl ? value.toFixed(0) : value.toFixed(1)
  };

  const tooltipFormatter = (value?: number, name?: string) => {
    if (name === PRODUCTION_TYPES.gas.name) {
      return [`${Number(value).toFixed(2)} ${UNITS.mm3}`, PRODUCTION_TYPES.gas.label];
    }

    if (name === PRODUCTION_TYPES.oil.name) {
      return [`${Number(value).toFixed(2)} ${unit}`, PRODUCTION_TYPES.oil.label];
    }

    if (name === PRODUCTION_TYPES.water.name) {
      return [`${Number(value).toFixed(2)} ${unit}`, PRODUCTION_TYPES.water.label];
    }
  };

  return (
    <div className="time-series-wrapper">
      <div className="time-series-controls-row">
        <UnitTabs onChange={setUnit} currentUnit={unit}/>
      </div>
      <div style={{height: 320}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{top: 10, right: 20, left: 0, bottom: 12}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={18} />
            <YAxis tickFormatter={yAxisTickFormatter}/>
            <Tooltip formatter={tooltipFormatter} itemStyle={{color: "var(--color-cat-2)"}}/>
            <Legend />
            <Line
              type="linear"
              dataKey="resourceProduction"
              name={`${PRODUCTION_TYPES[resource].label} (${unit})`}
              stroke={PRODUCTION_TYPES[resource].defaultColor}
              dot={{r: 3, strokeWidth: 1, fill: "var(--color-bg-surface)"}}
              activeDot={{r: 4}}
            />

            <Line
              type="linear"
              dataKey="anomalyMarker"
              name={`${PRODUCTION_TYPES[resource].name}`}
              stroke="transparent"
              connectNulls={false}
              dot={{r: 6, fill: "var(--color-anomaly)", stroke: "var(--color-bg-surface)", strokeWidth: 2}}
              activeDot={{r: 7, fill: "var(--color-anomaly)", stroke: "var(--color-bg-surface)", strokeWidth: 2}}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

