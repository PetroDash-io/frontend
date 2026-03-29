export interface ActiveWell {
  id: string;
  lon: number;
  lat: number;
  company: string;
  resource_type: string;
}

export interface WellDetail {
  well_id: string;
  watershed: string;
  province: string;
  area: string;
  company: string;
  field: string;
  formation: string;
  classification: string;
  resource_type: string;
  type: string;
  status: string;
  depth: number;
  geojson?: string;
}

export interface ProductionMonthly {
  year: number,
  month: number,
  well_id: string;
  reported_period_date: string; // "YYYY-MM-01"
  oil_production: number;
  gas_production: number;
  water_production: number;
  water_injection?: number;
  gas_injection?: number;
  co2_injection?: number;
}

export interface Company {
  empresa: string;
  cantidad_pozos: number;
}

export interface CompaniesResponse {
  source: string;
  total: number;
  data: Company[];
}

export interface AggregationData {
  total: number;
  avg: number;
  percentage?: number;
}

export interface ProductionAggregates {
  oil: AggregationData;
  gas: AggregationData;
  water: AggregationData;
}

export interface ProductionAggregatesFilters {
  empresa: string;
  inicio_anio: number;
  inicio_mes: number;
  fin_anio: number;
  fin_mes: number;
}

export interface CompanyProductionData {
  company: string;
  data: ProductionAggregates;
}

export interface CompanyComparisonResponse {
  source: string;
  start_year: number | null;
  start_month: number | null;
  end_year: number | null;
  end_month: number | null;
  companies: CompanyProductionData[];
}

export interface ComparisonFilters {
  empresa_1: string;
  empresa_2: string;
  inicio_anio?: number;
  inicio_mes?: number;
  fin_anio?: number;
  fin_mes?: number;
}

export interface WellProductionComparisonData {
  oil: {
    total: number;
    median: number;
  };
  gas: {
    total: number;
    median: number;
  };
  water: {
    total: number;
    median: number;
  };
}

export interface WellProductionComparisonResponse {
  source: string;
  well_id: number;
  company: string;
  area: string;
  province: string;
  start_year: number | null;
  start_month: number | null;
  end_year: number | null;
  end_month: number | null;
  data: WellProductionComparisonData[];
}

export interface WellProductionComparisonFilters {
  inicio_anio?: number;
  inicio_mes?: number;
  fin_anio?: number;
  fin_mes?: number;
  median_by?: string[];
}

export interface TopProductionData {
  company: string;
  total_production: number;
}

export interface TopProductionResponse {
  source: string;
  tipo: "oil" | "gas" | "water";
  provincia: string | null;
  area: string | null;
  start_year: number | null;
  start_month: number | null;
  end_year: number | null;
  end_month: number | null;
  data: TopProductionData[];
}

export interface TopProductionFilters {
  tipo: "oil" | "gas" | "water";
  provincia?: string;
  area?: string;
  inicio_anio?: number;
  inicio_mes?: number;
  fin_anio?: number;
  fin_mes?: number;
  limit?: number;
}

export type {
  ProductionResource,
  WellProductionAnomalyEvidence,
  WellProductionAnomalyPeriod,
} from "./anomalies";
