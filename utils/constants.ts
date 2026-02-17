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
  }
};

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



