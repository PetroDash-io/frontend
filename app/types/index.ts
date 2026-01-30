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

export type ItemDeReservorio = PozoDetail;

export interface ActivePozo {
  id: string;
  lon: number;
  lat: number;
}
