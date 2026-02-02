import { ESTADOS_POZO } from "./constants";

export const normalize = (value?: string) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const getPozoColor = (tipoestado?: string) => {
  if (!tipoestado) return "#9CA3AF";

  const estado = normalize(tipoestado);

  if (ESTADOS_POZO.ACTIVO.some(e => normalize(e) === estado))
    return "#22C55E";

  if (ESTADOS_POZO.PARADO.some(e => normalize(e) === estado))
    return "#FACC15";

  if (ESTADOS_POZO.INACTIVO.some(e => normalize(e) === estado))
    return "#EF4444";

  if (ESTADOS_POZO.NO_INFORMADO.some(e => normalize(e) === estado))
    return "#9CA3AF";

  return "#6B7280";
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