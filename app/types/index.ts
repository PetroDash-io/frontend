export interface ActivePozo {
  id: string;
  lon: number;
  lat: number;
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

