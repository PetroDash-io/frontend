import { useEffect, useState } from "react";
import { MonthlyAggregatedChart } from "@/components/production/MonthlyAggregatedChart";
import { useMonthlyAggregatedProduction } from "@/hooks/useMonthlyAggregatedProduction";
import { SelectFilter, SelectFilterOption } from "@/components/common/SelectFilter";
import { LoadingState } from "@/components/common/LoadingState";
import { InlineMessage } from "@/components/common/InlineMessage";

const groupByOptions: SelectFilterOption[] = [
  { value: "company", label: "Empresa" },
  { value: "watershed", label: "Cuenca" },
];

export function MonthlyAggregatedSection() {
  const [aggParams, setAggParams] = useState({
    group_by: "company",
    metric: "sum",
    fluid: "oil",
  });

  const [selectedGroup, setSelectedGroup] = useState("");

  const { data, loading, error } = useMonthlyAggregatedProduction(aggParams);

  const availableGroups = data
    ? [...new Set(data.map((d: any) => d.group))].sort()
    : [];


  useEffect(() => {
    if (availableGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(availableGroups[0]);
    }
  }, [availableGroups, selectedGroup]);

  return (
    <>

      <div style={styles.filterRow}>
        <SelectFilter
          value={aggParams.group_by}
          onSelect={(_, value) =>
            setAggParams((prev) => ({ ...prev, group_by: value }))
          }
          filterName="group_by"
          inputLabel="Agrupar por"
          options={groupByOptions}
        />

        <SelectFilter
          value={selectedGroup}
          onSelect={(_, value) => setSelectedGroup(value)}
          filterName="group"
          inputLabel="Grupo"
          options={availableGroups.map((g) => ({
            value: g,
            label: g,
          }))}
        />
      </div>


      {loading && <LoadingState />}

      {error && <InlineMessage message="Error cargando datos agregados." variant="error" />}

      {!loading && !error && availableGroups.length === 0 && (
        <InlineMessage message="No hay datos disponibles." variant="warning" />
      )}


      {!loading && !error && data && selectedGroup && (
        <MonthlyAggregatedChart
          data={data}
          selectedGroup={selectedGroup}
          groupBy={aggParams.group_by}
          metric={aggParams.metric}
        />
      )}
    </>
  );
}

const styles = {
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  } as React.CSSProperties,
};