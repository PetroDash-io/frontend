export const MAX_POZOS = 32817;

export const colors = {
  bg: "#F3EEE6",
  panel: "#2F3E34",
  panelBorder: "#3F6B4F",
  text: "#1F2937",
  textLight: "#F3EEE6",
  accent: "#D6A23A",
  primary: "#4B2A1A",
  secondary: "#3F6B4F",
  pozoActivo: "#22C55E",
  pozoParado: "#FACC15",
  pozoInactivo: "#EF4444",
  pozoNoInformado: "#9CA3AF",
  pozoUnknown: "#6B7280",
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
  { color: colors.pozoActivo, label: "Activo" },
  { color: colors.pozoParado, label: "Parado" },
  { color: colors.pozoInactivo, label: "Inactivo" },
  { color: colors.pozoNoInformado, label: "No informado" },
];


