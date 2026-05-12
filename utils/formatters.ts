export const formatTooltip = (value: number | string | undefined) => {
  if (typeof value === "number") {
    return value.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  return value;
};

export const formatYAxis = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(0);
};

export const formatYearMonth = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const [year, month] = value.split("-");
  if (!year || !month) return null;
  return `${month.padStart(2, "0")}/${year}`;
};
