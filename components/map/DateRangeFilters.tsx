import {MONTHS, YEARS} from "@/utils/constants";
import {SelectFilter} from "@/components/common/SelectFilter";
import {DateRangeValue} from "@/utils/dateRange";

interface DateRangeFiltersProps {
  value: DateRangeValue;
  onChange: (filterName: string, value: unknown) => void;
  isStartRangeIncomplete: boolean;
  isEndRangeIncomplete: boolean;
}

export function DateRangeFilters({
  value,
  onChange,
  isStartRangeIncomplete,
  isEndRangeIncomplete,
}: DateRangeFiltersProps) {
  return (
    <>
      <SelectFilter
        value={value.startYear}
        onSelect={onChange}
        filterName="startYear"
        inputLabel="Ano inicio"
        options={YEARS}
        hasError={isStartRangeIncomplete}
      />

      <SelectFilter
        value={value.startMonth}
        onSelect={onChange}
        filterName="startMonth"
        disabled={!value.startYear}
        defaultOptionLabel="Todos"
        inputLabel="Mes inicio"
        options={MONTHS}
        hasError={isStartRangeIncomplete}
      />

      <SelectFilter
        value={value.endYear}
        onSelect={onChange}
        filterName="endYear"
        inputLabel="Ano fin"
        options={YEARS}
        hasError={isEndRangeIncomplete}
      />

      <SelectFilter
        value={value.endMonth}
        onSelect={onChange}
        filterName="endMonth"
        disabled={!value.endYear}
        defaultOptionLabel="Todos"
        inputLabel="Mes fin"
        options={MONTHS}
        hasError={isEndRangeIncomplete}
      />
    </>
  );
}
