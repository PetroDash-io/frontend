export interface ActivePozo {
  id: string;
  lon: number;
  lat: number;
  company: string;
  resource_type: string;
}

export interface PozoDetail {
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

