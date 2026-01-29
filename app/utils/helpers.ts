import { ESTADOS_POZO } from "./constants";

export const normalize = (value?: string) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const NORMALIZED_ESTADOS_POZO = {
  ACTIVO: new Set(
    ESTADOS_POZO.ACTIVO.map(normalize).filter(
      (v): v is string => Boolean(v)
    )
  ),
  PARADO: new Set(
    ESTADOS_POZO.PARADO.map(normalize).filter(
      (v): v is string => Boolean(v)
    )
  ),
  INACTIVO: new Set(
    ESTADOS_POZO.INACTIVO.map(normalize).filter(
      (v): v is string => Boolean(v)
    )
  ),
  NO_INFORMADO: new Set(
    ESTADOS_POZO.NO_INFORMADO.map(normalize).filter(
      (v): v is string => Boolean(v)
    )
  ),
};

export const getPozoColor = (tipoestado?: string) => {
  if (!tipoestado) return "#9CA3AF";

  const estado = normalize(tipoestado);
  if (!estado) return "#9CA3AF";
  if (!estado) return "#9CA3AF";

  if (NORMALIZED_ESTADOS_POZO.ACTIVO.has(estado)) return "#22C55E";

  if (NORMALIZED_ESTADOS_POZO.PARADO.has(estado)) return "#FACC15";

  if (NORMALIZED_ESTADOS_POZO.INACTIVO.has(estado)) return "#EF4444";

  if (NORMALIZED_ESTADOS_POZO.NO_INFORMADO.has(estado)) return "#9CA3AF";

  return "#6B7280";
};
