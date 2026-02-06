"use client";

import React, {useEffect, useMemo, useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import { MAX_POZOS, colors } from "@/utils/constants";
import { toNumber} from "@/utils/helpers";
import {PozoDetail, ProductionMonthly} from "@/app/types";
import { WellsTable } from "@/components/WellsTable";
import { CurveChart } from "@/components/CurveChart";

import { MyMap } from "@/components/MyMap";
import { MyInfoContainer } from "@/components/MyInfoContainer";
import { ProductionAnalytics } from "@/components/ProductionAnalytics";

export default function Home() {
    const [reservorio, setReservorio] = useState<PozoDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        province: "ALL",
        status: "ALL",
        company: "ALL",
    });

    const [tab, setTab] = useState<"pozo" | "tabla" | "produccion">("pozo");
    const [limit, setLimit] = useState(100);
    const [selectedPozoId, setSelectedPozoId] = useState<string | null>(null);

    const [showCurve, setShowCurve] = useState(false);
    const [curveData, setCurveData] = useState<ProductionMonthly[] | null>(null);

    const reservorioFiltrado = useMemo(() => {
        return reservorio.filter((pozo) => {
            if (filters.province !== "ALL" && pozo.province !== filters.province) return false;
            if (filters.status !== "ALL" && pozo.status !== filters.status) return false;
            if (filters.company !== "ALL" && pozo.company !== filters.company) return false;
            return true;
        });
    }, [reservorio, filters]);

    const provinces = useMemo(
        () => [...new Set(reservorio.map((w) => w.province))].filter(Boolean),
        [reservorio]
    );
    const statuses = useMemo(
        () => [...new Set(reservorio.map((w) => w.status))].filter(Boolean),
        [reservorio]
    );
    const companies = useMemo(
        () => [...new Set(reservorio.map((w) => w.company))].filter(Boolean),
        [reservorio]
    );

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos?limit=${limit}`;
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url, {
                    headers: {
                        "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const json = await response.json();
                const { data } = json;

                const normalized: PozoDetail[] = Array.isArray(data) ? data : data ? [data] : [];
                setReservorio(normalized);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [limit]);

    const chartData = useMemo(() => {
        if (!curveData || curveData.length === 0) return null;

        return curveData
            .slice()
            .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date))
            .map((record) => ({
                date: record.reported_period_date.slice(0, 7), // "YYYY-MM"
                oil: toNumber(record.oil_production) ?? 0,
                gas: toNumber(record.gas_production) ?? 0,
                water: toNumber(record.water_production) ?? 0,
            }));
    }, [curveData]);

    return (
        <>
            <header style={styles.header}>
                <img src="/logo-no-background.png" alt="PetroDash" style={styles.logo} />
                <h1 style={styles.title}>PetroDash</h1>
            </header>

            <div style={styles.topControlsRow}>
                <button style={tabButtonStyle(tab === "pozo")} onClick={() => setTab("pozo")}>
                    Mapa
                </button>

                <button style={tabButtonStyle(tab === "tabla")} onClick={() => setTab("tabla")}>
                    Tabla
                </button>

                <button style={tabButtonStyle(tab === "produccion")} onClick={() => setTab("produccion")}>
                    Producción
                </button>
            </div>

            <div style={styles.topControlsRow}>
                <select
                    value={filters.province}
                    onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                    className="select-filter"
                    style={{ display: tab === "produccion" ? "none" : "block" }}>
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
                    className="select-filter"
                    style={{ display: tab === "produccion" ? "none" : "block" }}>
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
                    className="select-filter"
                    style={{ display: tab === "produccion" ? "none" : "block" }}>
                    <option value="ALL">Todas las empresas</option>
                    {companies.map((emp) => (
                        <option key={emp} value={emp}>
                            {emp}
                        </option>
                    ))}
                </select>
            </div>

            <main style={styles.main(tab)}>
                {tab !== "produccion" && (
                    <div style={styles.limitFilterContainer}>
                        <label style={styles.limitLabel}>
                            Cantidad de pozos:&nbsp;
                            <input
                                type="number"
                                min={1}
                                max={MAX_POZOS}
                                value={limit}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (!Number.isNaN(value) && value >= 1 && value <= MAX_POZOS) {
                                        setLimit(value);
                                    }
                                }}
                                style={styles.limitInput}
                            />
                        </label>
                    </div>
                )}

                {tab === "pozo" && (
                    <div style={styles.wellDetailsContainer}>
                        <MyMap reservorios={reservorioFiltrado} selectedPozoId={selectedPozoId} onSelectedPozo={(well_id) => setSelectedPozoId(well_id)} />
                        <MyInfoContainer selectedPozoId={selectedPozoId} showCurve={showCurve} curveData={curveData} onShowCurve={(show_curve) => setShowCurve(show_curve)} onCurveData={(curve_data) => setCurveData(curve_data)} />
                    </div>
                )}

                {tab === "tabla" && (
                    <WellsTable data={reservorioFiltrado} onSelectedPozo={(well_id) => setSelectedPozoId(well_id)} />
                )}

                {tab === "produccion" && (
                    <ProductionAnalytics />
                )}

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

                {showCurve && selectedPozoId && chartData && (
                    <CurveChart data={chartData} />
                )}
            </main>
        </>
    );
}

const styles = {
    header: {
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 28px",
        background: "linear-gradient(90deg, #3F6B4F, #4B2A1A)",
    } as React.CSSProperties,
    logo: {
        height: "100%",
        transform: "scale(1.3)",
        transformOrigin: "left center",
    } as React.CSSProperties,
    title: {
        fontSize: 22,
        fontWeight: 600,
        color: "#F3EEE6",
        letterSpacing: "0.5px",
    } as React.CSSProperties,
    topControlsRow: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties,
    main: (tab: "pozo" | "tabla" | "produccion") => ({
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: colors.bg
    }) as React.CSSProperties,
    limitFilterContainer: {
        display: "flex",
        flexDirection: "row"
    } as React.CSSProperties,
    wellDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        height: 560
    } as React.CSSProperties,
    limitLabel: {
        fontSize: 14,
        color: colors.text,
    } as React.CSSProperties,
    limitInput: {
        width: 120,
        padding: "6px 8px",
        borderRadius: 8,
        border: `1px solid ${colors.secondary}`,
        backgroundColor: "#fff",
    } as React.CSSProperties,
    errorMessageContainer: {
        display: "flex"
    } as React.CSSProperties,
    loadingContainer: {
        display: "flex"
    } as React.CSSProperties,
} as const;

function tabButtonStyle(active: boolean): React.CSSProperties {
    return {
        padding: "8px 16px",
        borderRadius: 8,
        border: "1px solid #3F6B4F",
        backgroundColor: active ? "#3F6B4F" : "transparent",
        color: active ? "#F3EEE6" : "#3F6B4F",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
    };
}