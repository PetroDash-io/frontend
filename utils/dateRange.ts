export interface DateRangeValue {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}

export const EMPTY_DATE_RANGE: DateRangeValue = {
  startYear: "",
  startMonth: "",
  endYear: "",
  endMonth: "",
};

const today = new Date();

export const DEFAULT_WELL_CHART_DATE_RANGE: DateRangeValue = {
  startYear: "2023",
  startMonth: "1",
  endYear: String(today.getFullYear()),
  endMonth: String(today.getMonth() + 1),
};

export const getValidatedDateRange = (inputs: DateRangeValue): DateRangeValue => {
  const hasStartYear = Boolean(inputs.startYear);
  const hasStartMonth = Boolean(inputs.startMonth);
  const hasEndYear = Boolean(inputs.endYear);
  const hasEndMonth = Boolean(inputs.endMonth);

  return {
    startYear: hasStartYear && hasStartMonth ? inputs.startYear : "",
    startMonth: hasStartYear && hasStartMonth ? inputs.startMonth : "",
    endYear: hasEndYear && hasEndMonth ? inputs.endYear : "",
    endMonth: hasEndYear && hasEndMonth ? inputs.endMonth : "",
  };
};

export interface DateRangeCompleteness {
  isStartRangeIncomplete: boolean;
  isEndRangeIncomplete: boolean;
}

export const getDateRangeCompleteness = (inputs: DateRangeValue): DateRangeCompleteness => {
  const hasStartYear = Boolean(inputs.startYear);
  const hasStartMonth = Boolean(inputs.startMonth);
  const hasEndYear = Boolean(inputs.endYear);
  const hasEndMonth = Boolean(inputs.endMonth);

  return {
    // "Todos" month intentionally leaves month empty; treat that as valid.
    isStartRangeIncomplete: hasStartMonth && !hasStartYear,
    isEndRangeIncomplete: hasEndMonth && !hasEndYear,
  };
};

export const applyDateRangeInputChange = (
  previousValues: DateRangeValue,
  filterName: string,
  value: unknown
): DateRangeValue => {
  const selectedValue = String(value ?? "");

  if (filterName === "startYear" && !selectedValue) {
    return {
      ...previousValues,
      startYear: "",
      startMonth: "",
    };
  }

  if (filterName === "endYear" && !selectedValue) {
    return {
      ...previousValues,
      endYear: "",
      endMonth: "",
    };
  }

  return {
    ...previousValues,
    [filterName]: selectedValue,
  };
};

export const getDateRangeWarningMessage = (
  isStartRangeIncomplete: boolean,
  isEndRangeIncomplete: boolean
) => {
  return [
    isStartRangeIncomplete ? "Fecha de inicio incompleta (falta ano o mes)." : "",
    isEndRangeIncomplete ? "Fecha de fin incompleta (falta ano o mes)." : "",
  ]
    .filter(Boolean)
    .join(" ");
};
