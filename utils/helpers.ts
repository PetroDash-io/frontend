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

export const getWellColor = (status?: string) => {
  if (!status) return colors.notInformedWell;

  const normalizedStatus = normalize(status);
  if (!normalizedStatus) return colors.notInformedWell;

  if (NORMALIZED_ESTADOS_POZO.ACTIVO.has(normalizedStatus)) return colors.activeWell;

  if (NORMALIZED_ESTADOS_POZO.PARADO.has(normalizedStatus)) return colors.stoppedWell;

  if (NORMALIZED_ESTADOS_POZO.INACTIVO.has(normalizedStatus)) return colors.inactiveWell;

  if (NORMALIZED_ESTADOS_POZO.NO_INFORMADO.has(normalizedStatus)) return colors.notInformedWell;

  return colors.unknownWell;
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