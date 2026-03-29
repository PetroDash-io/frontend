export const MAX_WELLS = 32817;


export const PRODUCTION_TYPES = {
  oil: {
    name: "oil",
    label: "Petróleo",
    defaultColor: "#3F6B4F"
  },
  gas: {
    name: "gas",
    label: "Gas",
    defaultColor: "#D97A00"
  },
  water: {
    name: "water",
    label: "Agua",
    defaultColor: "#3A7CA5"
  },
  water_injection: {
    name: "water_injection",
    label: "Inyección Agua",
    defaultColor: "#5EC1E6"
  },
  gas_injection: {
    name: "gas_injection",
    label: "Inyección Gas",
    defaultColor: "#FDAE10"
  },
  co2_injection: {
    name: "co2_injection",
    label: "Inyección CO2",
    defaultColor: "#7D3C98"
  },
  // Misspelled aliases for backward compatibility in code references.
  water_inyection: {
    name: "water_injection",
    label: "Inyección Agua",
    defaultColor: "#5EC1E6"
  },
  gas_inyection: {
    name: "gas_injection",
    label: "Inyección Gas",
    defaultColor: "#FDAE10"
  },
  co2_inyection: {
    name: "co2_injection",
    label: "Inyección CO2",
    defaultColor: "#7D3C98"
  },
};

// Backwards compatibility for previously misspelled production type keys.
// TODO: Migrate all usages from `*_inyection` to `*_injection` and then remove these aliases.
(PRODUCTION_TYPES as any).water_inyection = PRODUCTION_TYPES.water_injection;
(PRODUCTION_TYPES as any).gas_inyection = PRODUCTION_TYPES.gas_injection;
(PRODUCTION_TYPES as any).co2_inyection = PRODUCTION_TYPES.co2_injection;
export const colors = {
  bg: "#F3EEE6",
  panel: "#2F3E34",
  panelBorder: "#3F6B4F",
  text: "#1F2937",
  textLight: "#F3EEE6",
  accent: "#D6A23A",
  primary: "#4B2A1A",
  secondary: "#3F6B4F",
  selectedWell: "#0641f2",
  activeWell: "#22C55E",
  stoppedWell: "#FACC15",
  inactiveWell: "#EF4444",
  notInformedWell: "#9CA3AF",
  unknownWell: "#6B7280",
  // Production colors
  oil: "#3F6B4F",
  gas: "#D97A00",
  water: "#3A7CA5",
  filtersBg: "#FAFAF9",
  // Company comparison colors
  company1: "#3F6B4F",
  company2: "#D6A23A",
  company3: "#4B2A1A",
  company4: "#2F3E34",
  company5: "#6B7280",
};

export const COMPANY_COLORS = [
  "#3F6B4F", // Verde oscuro (secondary)
  "#D6A23A", // Dorado (accent/oil)
  "#4B2A1A", // Marrón oscuro (primary)
  "#2F3E34", // Verde muy oscuro (panel)
  "#6B7280", // Gris (water)
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
  "#3F6B4F", // Verde oscuro principal
  "#D6A23A", // Dorado/Oro
  "#4B2A1A", // Marrón oscuro
  "#D97A00", // Naranja tierra
  "#2F3E34", // Verde muy oscuro
  "#3A7CA5", // Azul petróleo
  "#8B6914", // Dorado oscuro
  "#5D7C5E", // Verde medio
  "#8B4513", // Marrón tierra
  "#6B8E23", // Verde oliva
  "#CD853F", // Terracota
  "#A0826D", // Beige oscuro
  "#4A5D4E", // Verde grisáceo
  "#9B7653", // Café con leche
  "#556B2F", // Verde oliva oscuro
  "#8B7355", // Marrón claro
  "#6B6B47", // Verde militar
  "#7C6A5C", // Taupe
  "#5C7A70", // Verde azulado
  "#8B7D6B", // Gris cálido
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


