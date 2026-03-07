import React, {useEffect, useMemo, useState} from "react";
import {WellsTable} from "@/components/table/WellsTable";
import {useWells} from "@/hooks/useWells";
import {LimitFilter} from "@/components/map/LimitFilter";
import {SELECT_DEFAULT_VALUE, SelectFilter} from "@/components/common/SelectFilter";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";

const DEFAULT_FILTERS = {
    province: SELECT_DEFAULT_VALUE,
    status: SELECT_DEFAULT_VALUE,
    company: SELECT_DEFAULT_VALUE,
    limit: 100,
}

export function TableView() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const {data: wells, loading: loading, error: error} = useWells({filters});
    const errorMessage = error || null;

    useEffect(() => {
        if (!errorMessage) return;
        toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
    }, [errorMessage]);

    // Cargar todos los pozos para obtener opciones de filtro
    const {data: allWells} = useWells({filters: {...DEFAULT_FILTERS, limit: 10000}});

    const provinces = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.province))].filter(Boolean);
    }, [allWells]);

    const statuses = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.status))].filter(Boolean);
    }, [allWells]);

    const companies = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.company))].filter(Boolean);
    }, [allWells]);

    const updateFilters = (filterName: string, value: unknown) => {
        setFilters((previousValues) => ({...previousValues, [filterName]: value}));
    }

    return (
        <>
            <div style={styles.filterPanel}>
                <SelectFilter filterName="province" value={filters.province} onSelect={updateFilters} options={provinces}
                              defaultOptionLabel="Todas las provincias"/>
                <SelectFilter filterName="status" value={filters.status} onSelect={updateFilters} options={statuses}
                              defaultOptionLabel="Todos los estados"/>
                <SelectFilter filterName="company" value={filters.company} onSelect={updateFilters} options={companies}
                              defaultOptionLabel="Todas las empresas"/>
                <LimitFilter filterName="limit" limit={filters.limit} onDefineLimit={updateFilters}/>
            </div>

            <WellsTable data={wells || []}/>

            {errorMessage && (
                <div style={styles.errorMessageContainer}>
                    <InlineMessage message={errorMessage || "Unexpected error"} variant="error"/>
                </div>
            )}

            {loading && (
                <div style={styles.loadingContainer}>
                    <LoadingState/>
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
