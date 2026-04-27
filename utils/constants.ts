export const MAX_WELLS = 32817;


export const PRODUCTION_TYPES = {
  oil: {
    name: "oil",
    label: "Petróleo",
    defaultColor: "var(--color-petroleum)"
  },
  gas: {
    name: "gas",
    label: "Gas",
    defaultColor: "var(--color-gas)"
  },
  water: {
    name: "water",
    label: "Agua",
    defaultColor: "var(--color-water)"
  },
  water_injection: {
    name: "water_injection",
    label: "Inyección Agua",
    defaultColor: "var(--color-inj-water)"
  },
  gas_injection: {
    name: "gas_injection",
    label: "Inyección Gas",
    defaultColor: "var(--color-inj-gas)"
  },
  co2_injection: {
    name: "co2_injection",
    label: "Inyección CO2",
    defaultColor: "var(--color-inj-co2)"
  },
};
export const colors = {
  bg: "var(--color-bg-base)",
  panel: "var(--color-bg-overlay)",
  panelBorder: "var(--color-border-subtle)",
  text: "var(--color-text-primary)",
  textLight: "var(--color-text-inverse)",
  accent: "var(--color-brand-light)",
  primary: "var(--color-brand-primary)",
  secondary: "var(--color-brand-mid)",
  selectedWell: "var(--color-brand-light)",
  activeWell: "var(--color-status-active)",
  stoppedWell: "var(--color-status-stopped)",
  inactiveWell: "var(--color-status-inactive)",
  notInformedWell: "var(--color-status-unknown)",
  unknownWell: "var(--color-status-unknown)",
  // Production colors
  oil: "var(--color-petroleum)",
  gas: "var(--color-gas)",
  water: "var(--color-water)",
  filtersBg: "var(--color-bg-surface)",
  // Company comparison colors
  company1: "var(--color-cat-1)",
  company2: "var(--color-cat-2)",
  company3: "var(--color-cat-3)",
  company4: "var(--color-cat-4)",
  company5: "var(--color-cat-5)",
};

export const COMPANY_COLORS = [
  "var(--color-cat-1)",
  "var(--color-cat-2)",
  "var(--color-cat-3)",
  "var(--color-cat-4)",
  "var(--color-cat-5)",
  "var(--color-cat-6)",
  "var(--color-cat-7)",
  "var(--color-cat-8)",
  "var(--color-cat-9)",
  "var(--color-cat-10)",
];

export const ESTADOS_POZO = {
  ACTIVO: [
    "Extracción Efectiva",
    "En Inyección Efectiva",
    "Otras Situación Activo",
    "Mantenimiento de Presión",
  ],
  PARADO: [
    "En Estudio",
    "Parado Alta Relación Agua/Petróleo",
    "En Espera de Reparación",
    "En Reserva de Gas",
    "Parado Transitoriamente",
    "En Reparación",
    "En Reserva para Recup. Sec./Asist.",
    "Parado Alta Relación Gas/Petróleo",
  ],
  INACTIVO: [
    "Abandonado",
    "Abandono Temporario",
    "A Abandonar",
    "Otras Situación Inactivo",
  ],
  NO_INFORMADO: ["No Informado"],
};

export const LEGEND_ITEMS = [
  { color: colors.activeWell, label: "Activo" },
  { color: colors.stoppedWell, label: "Parado" },
  { color: colors.inactiveWell, label: "Inactivo" },
  { color: colors.notInformedWell, label: "No informado" },
];

export const YEARS = Array.from(
    { length: new Date().getFullYear() - 2013 + 1 },
    (_, i) => 2013 + i
);

export const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

// Paleta de colores para pie charts (tonos tierra alineados con la estética)
export const PIE_CHART_COLORS = [
  "var(--color-cat-1)",
  "var(--color-cat-2)",
  "var(--color-cat-3)",
  "var(--color-cat-4)",
  "var(--color-cat-5)",
  "var(--color-cat-6)",
  "var(--color-cat-7)",
  "var(--color-cat-8)",
  "var(--color-cat-9)",
  "var(--color-cat-10)",
];

// Áreas organizadas por provincia (top áreas por cantidad de pozos)
export const AREAS_POR_PROVINCIA: Record<string, Array<{ value: string; label: string }>> = {
  Neuquen: [
    { value: "PUESTO HERNANDEZ", label: "Puesto Hernández" },
    { value: "CHIHUIDO DE LA SIERRA NEGRA", label: "Chihuido de la Sierra Negra" },
    { value: "EL TRAPIAL ESTE", label: "El Trapial Este" },
    { value: "LOMA LA LATA - SIERRA BARROSA", label: "Loma La Lata - Sierra Barrosa" },
    { value: "LOMA CAMPANA", label: "Loma Campana" },
    { value: "CENTENARIO CENTRO", label: "Centenario Centro" },
    { value: "AL NORTE DE LA DORSAL", label: "Al Norte de la Dorsal" },
    { value: "AGUA DEL CAJON", label: "Agua del Cajón" },
    { value: "EL PORVENIR", label: "El Porvenir" },
    { value: "AL SUR DE LA DORSAL", label: "Al Sur de la Dorsal" },
  ],
  Chubut: [
    { value: "ANTICLINAL GRANDE - CERRO DRAGON", label: "Anticlinal Grande - Cerro Dragón" },
    { value: "CAMPAMENTO CENTRAL - CAÑADON PERDIDO", label: "Campamento Central - Cañadón Perdido" },
    { value: "MANANTIALES BEHR", label: "Manantiales Behr" },
    { value: "DIADEMA", label: "Diadema" },
    { value: "ESCALANTE - EL TREBOL", label: "Escalante - El Trébol" },
    { value: "EL TORDILLO", label: "El Tordillo" },
    { value: "KM. 20", label: "Km. 20" },
    { value: "PAMPA DEL CASTILLO - LA GUITARRA", label: "Pampa del Castillo - La Guitarra" },
    { value: "RESTINGA ALI", label: "Restinga Alí" },
  ],
  Mendoza: [
    { value: "BARRANCAS", label: "Barrancas" },
    { value: "LA VENTANA", label: "La Ventana" },
    { value: "VALLE DEL RIO GRANDE", label: "Valle del Río Grande" },
    { value: "JAGÜEL CASA DE PIEDRA", label: "Jagüel Casa de Piedra" },
    { value: "CHIHUIDO DE LA SIERRA NEGRA", label: "Chihuido de la Sierra Negra" },
    { value: "VIZCACHERAS", label: "Vizcacheras" },
    { value: "CHACHAHUEN SUR", label: "Chachahuén Sur" },
    { value: "CAÑADON AMARILLO", label: "Cañadón Amarillo" },
    { value: "CERRO FORTUNOSO", label: "Cerro Fortunoso" },
  ],
  "La Pampa": [
    { value: "25 DE MAYO - MEDANITO SUD ESTE LP", label: "25 de Mayo - Medanito Sud Este LP" },
    { value: "MEDANITO", label: "Medanito" },
    { value: "CNQ 7/A", label: "CNQ 7/A" },
    { value: "JAGÜEL DE LOS MACHOS LP", label: "Jagüel de los Machos LP" },
    { value: "GOBERNADOR AYALA III", label: "Gobernador Ayala III" },
    { value: "MEDANITO SUR", label: "Medanito Sur" },
  ],
  "Rio Negro": [
    { value: "EL MEDANITO", label: "El Medanito" },
    { value: "SEÑAL PICADA - PUNTA BARDA", label: "Señal Picada - Punta Barda" },
    { value: "ENTRE LOMAS", label: "Entre Lomas" },
    { value: "25 DE MAYO - MEDANITO SUD ESTE RN", label: "25 de Mayo - Medanito Sud Este RN" },
    { value: "JAGÜEL DE LOS MACHOS RN", label: "Jagüel de los Machos RN" },
    { value: "ESTACION FERNANDEZ ORO", label: "Estación Fernández Oro" },
    { value: "BARRANCA DE LOS LOROS", label: "Barranca de los Loros" },
    { value: "CATRIEL OESTE", label: "Catriel Oeste" },
  ],
};

export const WATERSHED_OPTIONS= [
  {value: "GOLFO SAN JORGE", label: "Golfo de San Jorge"},
  {value: "NEUQUINA", label: "Neuquina"},
  {value: "CUYANA", label: "Cuyana"},
  {value: "AUSTRAL", label: "Austral"},
  {value: "NOROESTE", label: "Noroeste"},
  {value: "NORESTE", label: "Noreste"},
  {value: "ÑIRIHUAU", label: "Ñirihuau"},
  {value: "CAÑADON ASFALTO", label: "Cañadón asfalto"}
]
