import {MONTHS, YEARS} from "@/utils/constants";
import {SelectFilter} from "@/components/common/SelectFilter";

type YearMonthRangeFiltersProps = {
  onSelect: (filterName: string, value: string) => void;
  startYearName?: string;
  startMonthName?: string;
  endYearName?: string;
  endMonthName?: string;
  startYearValue: string | number;
  startMonthValue: string | number;
  endYearValue: string | number;
  endMonthValue: string | number;
  startYearLabel?: string;
  startMonthLabel?: string;
  endYearLabel?: string;
  endMonthLabel?: string;
};

export function YearMonthRangeFilters({
  onSelect,
  startYearName = "inicio_anio",
  startMonthName = "inicio_mes",
  endYearName = "fin_anio",
  endMonthName = "fin_mes",
  startYearValue,
  startMonthValue,
  endYearValue,
  endMonthValue,
  startYearLabel = "Año de inicio",
  startMonthLabel = "Mes de inicio",
  endYearLabel = "Año de fin",
  endMonthLabel = "Mes de fin",
}: YearMonthRangeFiltersProps) {
  return (
    <>
      <SelectFilter
        value={startYearValue}
        onSelect={onSelect}
        filterName={startYearName}
        defaultOptionLabel="Todos"
        inputLabel={startYearLabel}
        options={YEARS}
      />

      <SelectFilter
        value={startMonthValue}
        onSelect={onSelect}
        filterName={startMonthName}
        disabled={!startYearValue}
        defaultOptionLabel="Todos"
        inputLabel={startMonthLabel}
        options={MONTHS}
      />

      <SelectFilter
        value={endYearValue}
        onSelect={onSelect}
        filterName={endYearName}
        defaultOptionLabel="Todos"
        inputLabel={endYearLabel}
        options={YEARS}
      />

      <SelectFilter
        value={endMonthValue}
        onSelect={onSelect}
        filterName={endMonthName}
        disabled={!endYearValue}
        defaultOptionLabel="Todos"
        inputLabel={endMonthLabel}
        options={MONTHS}
      />
    </>
  );
}
