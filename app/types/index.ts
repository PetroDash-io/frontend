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

