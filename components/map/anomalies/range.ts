import {DateRangeValue} from "@/utils/dateRange";

export interface RequestedRangeWindow {
  start: string;
  end: string;
}

const formatYearMonth = (year: string, month: string) => `${year}-${month.padStart(2, "0")}`;

const toMonthTimestamp = (year: string, month: string) => new Date(Number(year), Number(month) - 1, 1).getTime();

export const getRequestedRangeWindow = (validatedDateRange: DateRangeValue): RequestedRangeWindow | null => {
  const hasStart = Boolean(validatedDateRange.startYear && validatedDateRange.startMonth);
  const hasEnd = Boolean(validatedDateRange.endYear && validatedDateRange.endMonth);

  if (!hasStart || !hasEnd) return null;

  return {
    start: formatYearMonth(validatedDateRange.startYear, validatedDateRange.startMonth),
    end: formatYearMonth(validatedDateRange.endYear, validatedDateRange.endMonth),
  };
};

export const getXAxisDomain = (
  validatedDateRange: DateRangeValue,
  requestedRange: RequestedRangeWindow | null
): [number | "dataMin", number | "dataMax"] => {
  if (!requestedRange) {
    return ["dataMin", "dataMax"];
  }

  return [
    toMonthTimestamp(validatedDateRange.startYear, validatedDateRange.startMonth),
    toMonthTimestamp(validatedDateRange.endYear, validatedDateRange.endMonth),
  ];
};

export const getRangeLabel = (requestedRange: RequestedRangeWindow | null) => {
  return requestedRange
    ? `${requestedRange.start} - ${requestedRange.end}`
    : "Rango completo";
};
