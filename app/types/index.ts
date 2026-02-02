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

export interface ActivePozo {
  id: string;
  lon: number;
  lat: number;
}
