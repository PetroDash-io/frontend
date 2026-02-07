import { ESTADOS_POZO, colors } from "@/utils/constants";

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
  if (!tipoestado) return colors.pozoNoInformado;

  const estado = normalize(tipoestado);
  if (!estado) return colors.pozoNoInformado;

  if (NORMALIZED_ESTADOS_POZO.ACTIVO.has(estado)) return colors.pozoActivo;

  if (NORMALIZED_ESTADOS_POZO.PARADO.has(estado)) return colors.pozoParado;

  if (NORMALIZED_ESTADOS_POZO.INACTIVO.has(estado)) return colors.pozoInactivo;

  if (NORMALIZED_ESTADOS_POZO.NO_INFORMADO.has(estado)) return colors.pozoNoInformado;

  return colors.pozoUnknown;
};

export const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}