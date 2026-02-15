import React, {useMemo, useState} from "react";
import {WellsTable} from "@/components/table/WellsTable";
import {useWells} from "@/hooks/useWells";
import {LimitFilter} from "@/components/map/LimitFilter";
import {WellDetail} from "@/app/types";
import {Filter} from "@/components/map/Filter";

const DEFAULT_FILTERS = {
    province: "ALL",
    status: "ALL",
    company: "ALL",
    limit: 100,
}

export function TableView() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const {data: wells, loading: loading, error: error} = useWells({filters});

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
                <Filter filterName="province" value={filters.province} onSelect={updateFilters} options={provinces}
                        defaultText="Todas las provincias"/>
                <Filter filterName="status" value={filters.status} onSelect={updateFilters} options={statuses}
                        defaultText="Todos los estados"/>
                <Filter filterName="company" value={filters.company} onSelect={updateFilters} options={companies}
                        defaultText="Todas las empresas"/>
                <LimitFilter filterName="limit" limit={filters.limit} onDefineLimit={updateFilters}/>
            </div>

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
};
