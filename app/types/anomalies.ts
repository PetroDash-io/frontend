export type ProductionResource = "oil" | "gas" | "water";

export interface WellProductionAnomalyEvidence {
  is_anomaly: boolean;
  reason: string | null;
  rule_used: string | null;
  score: number | null;
  relative_deviation: number | null;
  neighbors_used: number | null;
  median_neighbors: number | null;
  mad_neighbors: number | null;
}

export interface WellProductionAnomalyPeriod {
  year: number;
  month: number;
  well_id: number;
  reported_period_date: string;
  resource: ProductionResource;
  resource_production: number;
  anomaly: WellProductionAnomalyEvidence;
}
