import React, {useState, useMemo} from "react";
import {MapView} from "@/components/wells/MapView";
import {TableView} from "@/components/wells/TableView";
import {LimitFilter} from "@/components/wells/common/LimitFilter";
import {WellFilters} from "@/app/types/wellFilters";
import {SELECT_DEFAULT_VALUE, SelectFilter} from "@/components/common/SelectFilter";
import {colors, CONTENT_MAX_WIDTH, WATERSHED_OPTIONS} from "@/utils/constants";
import {useWells} from "@/hooks/useWells";

const DEFAULT_FILTERS = {
    watershed: "NEUQUINA",
    province: SELECT_DEFAULT_VALUE,
    status: SELECT_DEFAULT_VALUE,
    company: SELECT_DEFAULT_VALUE,
    limit: 100,
};

export function WellsView() {
    const [filters, setFilters] = useState<WellFilters>(DEFAULT_FILTERS);
    const [tablePage, setTablePage] = useState(0);
    const [selectedWellId, setSelectedWellId] = useState<number | null>(null);

    const updateFilters = (filterName: string, value: unknown) => {
        setFilters(prev => ({...prev, [filterName]: value}));
        setTablePage(0);
    };

    const [view, setView] = useState<"map" | "table">("map");
    const [dataMode, setDataMode] = useState<"pozos" | "heatmap">("pozos");
    const [heatmapResource, setHeatmapResource] = useState<"oil" | "gas" | "water">("oil");
    const {data: allWells, loading: loadingWells, error: errorGettingWells} = useWells({filters});

    const provinceFilterOptions = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.province))].filter((value): value is string => Boolean(value));
    }, [allWells]);

    const statusFilterOptions = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.status))].filter((value): value is string => Boolean(value));
    }, [allWells]);

    const companyFilterOptions = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.company))].filter((value): value is string => Boolean(value));
    }, [allWells]);

    return (
        <div style={styles.viewShell}>
            <div style={styles.resultsHeader}>
                <div>
                    <h2 style={styles.mainTitle}>Exploración de pozos</h2>
                </div>
                <div style={styles.tabBar}>
                    <button style={styles.tabBtn(view === "map")}  onClick={() => setView("map")}>
                        Mapa
                    </button>
                    <button style={styles.tabBtn(view === "table")} onClick={() => setView("table")}>
                        Tabla
                    </button>
                </div>
            </div>
            <div style={styles.filterPanel}>
                <SelectFilter
                    filterName="watershed"
                    value={filters.watershed}
                    onSelect={updateFilters}
                    options={WATERSHED_OPTIONS}/>
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

                <LimitFilter
                    filterName="limit"
                    limit={filters.limit}
                    onDefineLimit={updateFilters}/>
            </div>

            {view === "map" && (
                <>
                    <MapView
                        filters={filters}
                        wells={allWells || []}
                        loadingWells={loadingWells}
                        errorGettingWells={errorGettingWells}
                        mode={dataMode}
                        onChangeMode={setDataMode}
                        selectedWellId={selectedWellId}
                        onSelectWell={setSelectedWellId}
                        heatmapResource={heatmapResource}
                        onSelectHeatmapResource={setHeatmapResource}
                    />
                </>
            )}

            {view === "table" && (
                <TableView
                    filters={filters}
                    currentPage={tablePage}
                    onChangePage={setTablePage}
                />
            )}
        </div>
    );
}

const styles = {
    mainTitle: {
        fontSize: "24px",
        fontWeight: 600,
        color: colors.primary,
        margin: 0,
    } as React.CSSProperties,
    filterPanel: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        alignItems: "end",
        gap: 16,
        padding: "16px",
        marginBottom: 18,
        borderRadius: "var(--radius-2xl)",
        border: "1px solid var(--color-brand-subtle)",
        backgroundColor: "var(--color-surface-glass)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
    } as React.CSSProperties,
    viewShell: {
        width: "100%",
        maxWidth: CONTENT_MAX_WIDTH,
        margin: "0 auto",
    } as React.CSSProperties,
    tabBar: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 4,
        borderRadius: 999,
        border: "1px solid var(--color-border-subtle)",
        backgroundColor: "var(--color-bg-surface)",
    } as React.CSSProperties,
    resultsHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        marginTop: 6,
        marginBottom: 12,
        padding: "10px 12px",
        backgroundColor: "transparent",
    } as React.CSSProperties,
    resultsHeaderLabel: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
        color: "var(--color-text-secondary)",
    } as React.CSSProperties,
    tabBtn: (active: boolean) => ({
        padding: "8px 14px",
        borderRadius: 999,
        border: `1px solid ${active ? "var(--color-brand-mid)" : "transparent"}`,
        backgroundColor: active ? "var(--color-brand-mid)" : "var(--color-bg-surface)",
        color: active ? "var(--color-text-inverse)" : "var(--color-brand-mid)",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        transition: "all 0.18s ease",
        boxShadow: active ? `0 4px 10px var(--color-brand-glow)` : "none",
    }) as React.CSSProperties,
} as const;

export function WellIcon({width = 18, height = 18}: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 5.5v13a2 2 0 01-2 2H8a2 2 0 01-2-2v-13" stroke="currentColor" strokeWidth="2"
                  strokeLinejoin="round"/>
            <path d="M6 8h12M6 12h12M6 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}
