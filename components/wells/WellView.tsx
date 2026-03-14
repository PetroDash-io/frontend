"use client";

import {useState, useMemo} from "react";
import {MapView} from "@/components/map/MapView";
import {TableView} from "@/components/table/TableView";
import {LimitFilter} from "@/components/map/LimitFilter";
import {WellFilters} from "@/app/types/wellFilters";
import {SELECT_DEFAULT_VALUE, SelectFilter} from "@/components/common/SelectFilter";
import {useWells} from "@/hooks/useWells";

const DEFAULT_FILTERS = {
    province: SELECT_DEFAULT_VALUE,
    status: SELECT_DEFAULT_VALUE,
    company: SELECT_DEFAULT_VALUE,
    limit: 100,
};

export function WellView() {
  const [filters, setFilters] = useState<WellFilters>({
    province: "",
    status: "",
    company: "",
    limit: 100,
  });
  const [view, setView] = useState<"map" | "table">("map");
  const [dataMode, setDataMode] = useState<"pozos" | "heatmap">("pozos");
  const [heatmapResource, setHeatmapResource] = useState<"oil" | "gas" | "water">("oil");

  const updateFilters = (filterName: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const { data: allWells } = useWells({ filters: { ...DEFAULT_FILTERS, limit: 10000 } });

  const provinceFilterOptions = useMemo(() => {
    if (!allWells) return [];
    return [...new Set(allWells.map((well) => well.province))].filter(Boolean);
  }, [allWells]);

  const statusFilterOptions = useMemo(() => {
    if (!allWells) return [];
    return [...new Set(allWells.map((well) => well.status))].filter(Boolean);
  }, [allWells]);

  const companyFilterOptions = useMemo(() => {
    if (!allWells) return [];
    return [...new Set(allWells.map((well) => well.company))].filter(Boolean);
  }, [allWells]);

  return (
    <div>
      <div style={styles.filterPanel}>
        <SelectFilter
          filterName="province"
          value={filters.province}
          onSelect={updateFilters}
          options={provinceFilterOptions}
          defaultOptionLabel="Todas las provincias"
        />

        <SelectFilter
          filterName="status"
          value={filters.status}
          onSelect={updateFilters}
          options={statusFilterOptions}
          defaultOptionLabel="Todos los estados"
        />

        <SelectFilter
          filterName="company"
          value={filters.company}
          onSelect={updateFilters}
          options={companyFilterOptions}
          defaultOptionLabel="Todas las empresas"
        />

        <LimitFilter filterName="limit" limit={filters.limit} onDefineLimit={updateFilters} />
      </div>

      <div style={styles.tabBar}>
        <button
          style={styles.tabBtn(view === "map")}
          onClick={() => setView("map")}
        >
          Mapa
        </button>
        <button
          style={styles.tabBtn(view === "table")}
          onClick={() => setView("table")}
        >
          Tabla
        </button>
      </div>

      {view === "map" && (
        <>
          <div style={styles.modeBar}>
            <button
              style={styles.modeBtn(dataMode === "pozos")}
              onClick={() => setDataMode("pozos")}
            >
              Pozos
            </button>
            <button
              style={styles.modeBtn(dataMode === "heatmap")}
              onClick={() => setDataMode("heatmap")}
            >
              Heatmap
            </button>
          </div>

          <MapView
            filters={filters}
            mode={dataMode}
            heatmapResource={heatmapResource}
            onSelectHeatmapResource={setHeatmapResource}
          />
        </>
      )}

      {view === "table" && <TableView filters={filters} />}
    </div>
  );
}

const styles = {
  filterPanel: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    padding: "16px 24px",
    marginBottom: 18,
    borderRadius: 14,
    border: "1px solid rgba(63, 107, 79, 0.18)",
    backgroundColor: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  tabBar: {
    display: "flex",
    gap: 18,
    justifyContent: "center",
    marginTop: 8,
  } as React.CSSProperties,
  tabBtn: (active: boolean) => ({
    padding: "12px 22px",
    borderRadius: 999,
    border: `2px solid ${active ? "#3F6B4F" : "#C4B89A"}`,
    backgroundColor: active ? "#3F6B4F" : "rgba(255,255,255,0.75)",
    color: active ? "#F3EEE6" : "#3F6B4F",
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 0.4,
    transition: "all 0.18s ease",
    boxShadow: active ? "0 10px 20px rgba(63, 107, 79, 0.22)" : "none",
  }) as React.CSSProperties,
  modeBar: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginTop: 16,
  } as React.CSSProperties,
  modeBtn: (active: boolean) => ({
    padding: "10px 18px",
    borderRadius: 999,
    border: `2px solid ${active ? "#D6A23A" : "#C4B89A"}`,
    backgroundColor: active ? "#D6A23A" : "rgba(255,255,255,0.7)",
    color: active ? "#2F3E34" : "#3F6B4F",
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 0.4,
    transition: "all 0.18s ease",
    boxShadow: active ? "0 8px 16px rgba(214, 162, 58, 0.25)" : "none",
  }) as React.CSSProperties,
} as const;
