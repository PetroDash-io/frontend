export interface ActiveWell {
  id: number;
  lon: number;
  lat: number;
  company: string | null;
  resource_type: string | null;
}

export interface WellGeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface WellDetail {
  well_id: string | number;
  watershed: string;
  province: string;
  area: string;
  company: string | null;
  field: string;
  formation: string;
  classification: string;
  resource_type: string | null;
  well_type: string;
  extraction_type: string;
  status: string;
  depth: number;
  geojson?: string | WellGeoPoint;
}

export interface ProductionMonthly {
  year: number,
  month: number,
  well_id: string;
  data_date: string; // "YYYY-MM-01"
  oil_production: number;
  gas_production: number;
  water_production: number;
  produccion_acumulada?: number;
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
  watershed?: string;
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
  watershed?: string;
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
  watershed?: string;
  provincia?: string;
  area?: string;
  inicio_anio?: number;
  inicio_mes?: number;
  fin_anio?: number;
  fin_mes?: number;
  limit?: number;
}

export interface MapMetricsResponse {
  source: string;
  resource: "oil" | "gas" | "water";
  active_wells: number;
  stopped_wells: number;
  inactive_wells: number;
  not_informed_wells: number;
  total_production_last_month: number | null;
  last_month: string | null;
}

export type {
  ProductionResource,
  WellProductionAnomalyEvidence,
  WellProductionAnomalyPeriod,
} from "./anomalies";
