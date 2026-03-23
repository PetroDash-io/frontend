import {ProductionMonthly} from "@/app/types";
import {ProductionResource, WellProductionAnomalyPeriod, AnomalyChartPoint} from "@/components/map/anomalies/types";
import {convertValueToUnit} from "@/utils/units";

const reportedPeriodToUtcTimestamp = (reportedPeriodDate: string): number => {
  const [year, month] = reportedPeriodDate.split("-").map((part) => Number(part));
  return Date.UTC(year, month - 1, 1);
};

export const getAnomalyDateSet = (anomalyPeriods: WellProductionAnomalyPeriod[] | null): Set<string> => {
  if (!anomalyPeriods || anomalyPeriods.length === 0) {
    return new Set<string>();
  }

  const filteredPeriods = anomalyPeriods.filter((period) => period.anomaly?.is_anomaly === true);
  return new Set(filteredPeriods.map((period) => period.reported_period_date.slice(0, 7)));
};

export const buildAnomalyChartData = (
  anomalyProduction: ProductionMonthly[] | null,
  selectedResource: ProductionResource,
  unit: string,
  anomalyDateSet: Set<string>
): AnomalyChartPoint[] => {
  if (!anomalyProduction || anomalyProduction.length === 0) return [];

  const resourceFieldByName: Record<ProductionResource, keyof ProductionMonthly> = {
    oil: "oil_production",
    gas: "gas_production",
    water: "water_production",
  };

  const selectedResourceField = resourceFieldByName[selectedResource];

  return anomalyProduction
    .slice()
    .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date))
    .map((period) => {
      const rawValue = Number(period[selectedResourceField] || 0);
      const convertedValue =
        selectedResource === "gas" ? rawValue : convertValueToUnit(rawValue, unit);
      const date = period.reported_period_date.slice(0, 7);

      return {
        date,
        dateTs: reportedPeriodToUtcTimestamp(period.reported_period_date),
        resourceProduction: convertedValue,
        anomalyMarker: anomalyDateSet.has(date) ? convertedValue : null,
      };
    });
};
