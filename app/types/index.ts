export interface ItemDeReservorio {
  idpozo: string;
  tipoestado?: string;
  geojson?: string;
  [key: string]: unknown;
}

export interface ActivePozo {
  id: string;
  lon: number;
  lat: number;
}

export interface PozoDetail {
  idpozo: string;
  cuenca: string;
  provincia: string;
  area: string;
  empresa: string;
  yacimiento: string;
  formacion: string;
  clasificacion: string;
  tipo_recurso: string;
  tipopozo: string;
  tipoestado: string;
  profundidad: number;
  geojson?: string;
}
