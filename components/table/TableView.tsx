import React, {useMemo, useState} from "react";
import {WellsTable} from "@/components/table/WellsTable";
import {useWells} from "@/hooks/useWells";
import {LimitFilter} from "@/components/map/LimitFilter";
import {WellDetail} from "@/app/types";

const DEFAULT_FILTERS = {
    province: "ALL",
    status: "ALL",
    company: "ALL",
    limit: 100,
}

export function TableView() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const {data: wells, loading: loadingWells, error: errorGettingWells} = useWells({filters});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filteredWells = useMemo(() => {
        if (!wells) return [];

        return wells.filter((well: WellDetail) => {
            if (filters.province !== "ALL" && well.province !== filters.province) return false;
            if (filters.status !== "ALL" && well.status !== filters.status) return false;
            if (filters.company !== "ALL" && well.company !== filters.company) return false;
            return true;
        });
    }, [wells, filters]);

    const provinces = useMemo(() => {
        if (!wells) return [];
        return [...new Set(wells.map((well) => well.province))].filter(Boolean);
    }, [wells]);

    const statuses = useMemo(() => {
        if (!wells) return [];
        return [...new Set(wells.map((well) => well.status))].filter(Boolean);
    }, [wells]);

    const companies = useMemo(() => {
        if (!wells) return [];
        return [...new Set(wells.map((well) => well.company))].filter(Boolean);
    }, [wells]);

    const updateFilters = (filterName: string, value: unknown) => {
        setFilters((previousValues) => ({...previousValues, [filterName]: value}));
    }

    return (
        <>
            <div style={styles.filterPanel}>
                <select
                    value={filters.province}
                    onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                    className="select-filter">
                    <option value="ALL">Todas las provincias</option>
                    {provinces.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="select-filter">
                    <option value="ALL">Todos los estados</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.company}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="select-filter">
                    <option value="ALL">Todas las empresas</option>
                    {companies.map((emp) => (
                        <option key={emp} value={emp}>
                            {emp}
                        </option>
                    ))}
                </select>
            </div>

            <LimitFilter filterName="limit" limit={filters.limit} onDefineLimit={updateFilters}/>

            <WellsTable data={filteredWells}/>

            {error && (
                <div style={styles.errorMessageContainer}>
                    <p style={{ color: "#b91c1c" }}>Error: {error}</p>
                </div>
            )}

            {loading && (
                <div style={styles.loadingContainer}>
                    <p>Cargando pozos...</p>
                </div>
            )}
        </>
    )
}

const styles = {
    filterPanel: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties,
    errorMessageContainer: {
        display: "flex"
    } as React.CSSProperties,
    loadingContainer: {
        display: "flex"
    } as React.CSSProperties,
} as const;
