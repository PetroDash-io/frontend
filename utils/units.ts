export const UNITS = {
    m3: "m³",
    bbl: "BBL",
    mm3: "Mm³" // Para producción de gas, se usa millones de m³
};

const M3_TO_BBL = 6.28981; // 1 m³ = 6.28981 bbl (barriles)

export const toDisplayUnit = (value: number | null, expectedUnit: string): number | null => {
    if (value === null) return value;

    if (expectedUnit === UNITS.bbl) return value * M3_TO_BBL;

    return value; // Para cualquier otra unidad, se devuelve el valor original
}

