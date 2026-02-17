import React, {useMemo, useState} from "react";
import {WellDetail} from "@/app/types";
import {toNumber} from "@/utils/helpers";
import {TimeSeriesChart} from "@/components/map/TimeSeriesChart";
import {WellInfo} from "@/components/map/WellInfo";
import {WellsMap} from "@/components/map/WellsMap";
import {SELECT_DEFAULT_VALUE, SelectFilter} from "@/components/common/SelectFilter";
import {LimitFilter} from "@/components/map/LimitFilter";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useWellsProduction} from "@/hooks/useWellProduction";

const DEFAULT_FILTERS = {
    province: SELECT_DEFAULT_VALUE,
    status: SELECT_DEFAULT_VALUE,
    company: SELECT_DEFAULT_VALUE,
    limit: 100,
}

export function MapView() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const {data: wells, loading: loadingWells, error: errorGettingWells} = useWells({filters});
    const [selectedWellId, setSelectedWellId] = useState<string | null>(null);
    const {data: selectedWellDetails, loading: loadingWell, error: errorGettingWellDetails} = useWell({wellId: selectedWellId});
    const {data: wellProduction, loading: loadingWellProduction, error: errorGettingWellProduction} = useWellsProduction({wellId: selectedWellId});

    const filteredWells = useMemo(() => {
        if (!wells) return [];

        return wells.filter((well: WellDetail) => {
            if (filters.province !== SELECT_DEFAULT_VALUE && well.province !== filters.province) return false;
            if (filters.status !== SELECT_DEFAULT_VALUE && well.status !== filters.status) return false;
            if (filters.company !== SELECT_DEFAULT_VALUE && well.company !== filters.company) return false;
            return true;
        });
    }, [wells, filters]);

    const provinceFilterOptions = useMemo(() => {
        if (!wells) return [];
        return [...new Set(wells.map((well) => well.province))].filter(Boolean);
    }, [wells]);

    const statusFilterOptions = useMemo(() => {
        if (!wells) return [];
        return [...new Set(wells.map((well) => well.status))].filter(Boolean);
    }, [wells]);

    const companyFilterOptions = useMemo(() => {
        if (!wells) return [];
        return [...new Set(wells.map((well) => well.company))].filter(Boolean);
    }, [wells]);

    const timeSeriesChartData = useMemo(() => {
        if (!wellProduction || wellProduction.length === 0) return null;

        return wellProduction
            .slice()
            .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date))
            .map((record) => ({
                date: record.reported_period_date.slice(0, 7), // "YYYY-MM"
                oil: toNumber(record.oil_production) ?? 0,
                gas: toNumber(record.gas_production) ?? 0,
                water: toNumber(record.water_production) ?? 0,
            }));
    }, [wellProduction]);

    const updateFilters = (filterName: string, value: unknown) => {
        setFilters((previousValues) => ({...previousValues, [filterName]: value}));
    }

    return (
        <>
            <div style={styles.filterPanel}>
                <SelectFilter filterName="province" value={filters.province} onSelect={updateFilters} options={provinceFilterOptions}
                              defaultOptionLabel="Todas las provincias"/>
                <SelectFilter filterName="status" value={filters.status} onSelect={updateFilters} options={statusFilterOptions}
                              defaultOptionLabel="Todos los estados"/>
                <SelectFilter filterName="company" value={filters.company} onSelect={updateFilters} options={companyFilterOptions}
                              defaultOptionLabel="Todas las empresas"/>
                <LimitFilter filterName="limit" limit={filters.limit} onDefineLimit={updateFilters}/>
            </div>

            <div style={styles.wellDetailsContainer}>
                <WellsMap wells={filteredWells} selectedWellId={selectedWellId} onSelectWell={setSelectedWellId} />
                <WellInfo wellInfo={selectedWellDetails} loadingWell={loadingWell}/>
            </div>

            {wellProduction && <TimeSeriesChart data={timeSeriesChartData}/>}

            {errorGettingWells && (
                <div style={styles.errorMessageContainer}>
                    <p style={{ color: "#b91c1c" }}>Error: {errorGettingWells}</p>
                </div>
            )}

            {loadingWells && (
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
    wellDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        height: 560
    } as React.CSSProperties,
} as const;
