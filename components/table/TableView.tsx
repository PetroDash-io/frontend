import React, {useMemo, useState} from "react";
import {WellsLimiter} from "@/components/common/WellsLimiter";
import {WellsTable} from "@/components/table/WellsTable";
import {PozoDetail} from "@/app/types";

export function TableView() {
    const [reservoirs, setReservoirs] = useState<PozoDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        province: "ALL",
        status: "ALL",
        company: "ALL",
    });

    const filteredReservoirs = useMemo(() => {
        return reservoirs.filter((pozo) => {
            if (filters.province !== "ALL" && pozo.province !== filters.province) return false;
            if (filters.status !== "ALL" && pozo.status !== filters.status) return false;
            if (filters.company !== "ALL" && pozo.company !== filters.company) return false;
            return true;
        });
    }, [reservoirs, filters]);

    const provinces = useMemo(
        () => [...new Set(reservoirs.map((w) => w.province))].filter(Boolean),
        [reservoirs]
    );
    const statuses = useMemo(
        () => [...new Set(reservoirs.map((w) => w.status))].filter(Boolean),
        [reservoirs]
    );
    const companies = useMemo(
        () => [...new Set(reservoirs.map((w) => w.company))].filter(Boolean),
        [reservoirs]
    );

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

            <WellsLimiter setReservoirs={setReservoirs} setLoading={setLoading} setError={setError} />

            <WellsTable data={filteredReservoirs}/>

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
