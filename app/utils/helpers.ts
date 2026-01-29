import { ESTADOS_POZO, colors } from "./constants";

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
