import {ProductionMonthly} from "@/app/types";
import {AnomalyChartPoint, ProductionResource} from "@/components/well-analysis/anomalies/types";
import {convertValueToUnit} from "@/utils/units";
import {PRODUCTION_TYPES} from "@/utils/constants";

const dataDateToUtcTimestamp = (dataDate: string): number => {
  const [year, month] = dataDate.split("-").map((part) => Number(part));
  return Date.UTC(year, month - 1, 1);
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
    .sort((a, b) => a.data_date.localeCompare(b.data_date))
    .map((period) => {
      const rawValue = Number(period[selectedResourceField] || 0);
      const convertedValue =
        selectedResource === PRODUCTION_TYPES.gas.name ? rawValue : convertValueToUnit(rawValue, unit);
      const date = period.data_date.slice(0, 7);

      return {
        date,
        dateTs: dataDateToUtcTimestamp(period.data_date),
        resourceProduction: convertedValue,
        anomalyMarker: anomalyDateSet.has(date) ? convertedValue : null,
      };
    });
};
