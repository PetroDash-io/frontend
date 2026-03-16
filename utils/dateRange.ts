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
