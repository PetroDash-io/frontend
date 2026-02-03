"use client";

import React, {useEffect, useMemo, useState} from "react";
import Map, {Marker, Popup} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { MAX_POZOS, colors, LEGEND_ITEMS } from "./utils/constants";
import {getPozoColor, toNumber} from "./utils/helpers";
import { LegendItem } from "./components/LegendItem";
import {ActivePozo, PozoDetail, ProductionMonthly} from "./types";
import { WellsTable } from "./components/WellsTable";
import {ProductionMonthlyResponse} from "@/app/api_client/ProductionMonthlyResponse";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function Home() {
    const [reservorio, setReservorio] = useState<PozoDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        province: "ALL",
        status: "ALL",
        company: "ALL",
    });

    const [tab, setTab] = useState<"pozo" | "tabla">("pozo");
    const [activePozo, setActivePozo] = useState<ActivePozo | null>(null);
    const [limit, setLimit] = useState(100);
    const [selectedPozoId, setSelectedPozoId] = useState<string | null>(null);
    const [focusedPozoId, setFocusedPozoId] = useState<string | null>(null);
  const [pozoDetail, setPozoDetail] = useState<PozoDetail | null>(null);
    const [loadingPozo, setLoadingPozo] = useState(false);

    const [showCurve, setShowCurve] = useState(false);
    const [curveLoading, setCurveLoading] = useState(false);
    const [curveError, setCurveError] = useState<string | null>(null);
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

    useEffect(() => {
        if (!selectedPozoId) return;

        const fetchPozo = async () => {
            setLoadingPozo(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/pozos/${selectedPozoId}`,
                    {
                        headers: {
                            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al cargar el pozo");
                }

                const json = await response.json();
                const data = json?.data;
        setPozoDetail(Array.isArray(data) && data.length > 0 ? data[0] : null);
            } catch {
                setPozoDetail(null);
            } finally {
                setLoadingPozo(false);
            }
        };

        fetchPozo();
    }, [selectedPozoId]);

    useEffect(() => {
        setShowCurve(false);
        setCurveLoading(false);
        setCurveError(null);
        setCurveData(null);
    }, [selectedPozoId]);

    async function fetchProductionForSelectedWell(wellId: string) {
        setCurveLoading(true);
        setCurveError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/produccion-mensual`, {
                headers: {
                    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                },
            });

            if (!response.ok) {
                // si el backend devuelve 404 con detail, lo mostramos
                let errorMessage = `Error al cargar producción mensual (status ${response.status})`;
                try {
                    const jsonResponse = await response.json();
                    if (jsonResponse?.detail) errorMessage = jsonResponse.detail;
                } catch {}
                throw new Error(errorMessage);
            }

            const json: ProductionMonthlyResponse = await response.json();
            const rows = Array.isArray(json.data) ? json.data : [];

            // Orden defensivo por fecha (aunque ya venga ordenado)
            rows.sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date));

            setCurveData(rows);
        } catch (error) {
            setCurveData(null);
            setCurveError(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setCurveLoading(false);
        }
    }

    function onToggleCurve() {
        if (!selectedPozoId) return;

        if (!showCurve) {
            setShowCurve(true);
            if (!curveData && !curveLoading) {
                fetchProductionForSelectedWell(selectedPozoId);
            }
            return;
        }

        setShowCurve(false);
    }

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
            </div>

            <div style={styles.topControlsRow}>
                <select
                    value={filters.province}
                    onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                    className="select-filter">
                    <option value="ALL">Todas las provinces</option>
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

            <main style={styles.main(tab)}>
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

                {tab === "pozo" && (
                    <div style={styles.wellDetailsContainer}>
                        <div style={styles.mapContainer}>
                            <div style={styles.legendBar}>
                                {LEGEND_ITEMS.map((item) => (
                                    <LegendItem key={item.label} color={item.color} label={item.label} />
                                ))}
                            </div>
                            <Map
                                initialViewState={{
                                    longitude: -68.059167,
                                    latitude: -38.951944,
                                    zoom: 6,
                                }}
                                style={styles.map}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}>
                                {reservorioFiltrado.map((item) => {
                                    if (!item.geojson) return null;

                                    let lon: number, lat: number;
                                    try {
                                        const geo = JSON.parse(item.geojson);
                                        [lon, lat] = geo.coordinates;
                                    } catch {
                                        return null;
                                    }

                                    const isSelected = selectedPozoId === item.well_id;

                                    return (
                                        <Marker key={item.well_id} longitude={lon} latitude={lat} anchor="center">
                                            <div
                                                onMouseEnter={() => setActivePozo({ id: item.well_id, lon, lat })}
                                                onMouseLeave={() => setActivePozo(null)}
                                                onClick={() => setSelectedPozoId(item.well_id)}
                                                style={styles.markerDot({ selected: isSelected, status: item.status })}
                                            />
                                        </Marker>
                                    );
                                })}

                                {activePozo && (
                                    <Popup
                                        longitude={activePozo.lon}
                                        latitude={activePozo.lat}
                                        closeButton={false}
                                        closeOnClick
                                        anchor="top"
                                    >
                                        <div style={styles.popupBox}>
                                            <b>Pozo:</b> {activePozo.id}
                                        </div>
                                    </Popup>
                                )}
                            </Map>
                        </div>
                        <div style={styles.infoContainer}>
                            {!selectedPozoId && <p style={styles.sidePanelHint}>Seleccioná un pozo en el mapa</p>}
                            {loadingPozo && <p>Cargando información...</p>}

                            {pozoDetail && !loadingPozo && (
                                <>
                                    <h3 style={styles.sidePanelTitle}>Pozo {pozoDetail.well_id}</h3>

                                    <dl style={styles.detailGrid}>
                                        {[
                                            ["Cuenca", pozoDetail.watershed],
                                            ["Provincia", pozoDetail.province],
                                            ["Área", pozoDetail.area],
                                            ["Empresa", pozoDetail.company],
                                            ["Yacimiento", pozoDetail.field],
                                            ["Formación", pozoDetail.formation],
                                            ["Clasificación", pozoDetail.classification],
                                            ["Tipo recurso", pozoDetail.resource_type],
                                            ["Tipo pozo", pozoDetail.type],
                                            ["Estado", pozoDetail.status],
                                            ["Profundidad", `${pozoDetail.depth} metros`],
                                        ].map(([label, value]) => (
                                            <React.Fragment key={label}>
                                                <dt style={styles.detailLabel}>{label}</dt>
                                                <dd>{value}</dd>
                                            </React.Fragment>
                                        ))}
                                    </dl>

                                    <div style={styles.showCurveButtonContainer}>
                                        <button
                                            style={styles.showCurveButton(showCurve)}
                                            disabled={!selectedPozoId || curveLoading}
                                            onClick={onToggleCurve}
                                            title={!selectedPozoId ? "Seleccioná un pozo" : "Ver curva de vida"}
                                        >
                                            {showCurve ? "Ocultar curva de vida" : "Ver curva de vida"}
                                        </button>

                                        {showCurve && (
                                            <button
                                                style={styles.showCurveSecondaryButton}
                                                disabled={!selectedPozoId || curveLoading}
                                                onClick={() => selectedPozoId && fetchProductionForSelectedWell(selectedPozoId)}
                                                title="Volver a pedir a la API">
                                                Refrescar
                                            </button>
                                        )}
                                    </div>

                                    {showCurve && curveLoading && <p style={styles.curveHint}>Cargando producción mensual...</p>}
                                    {showCurve && curveError && (
                                        <p style={{ ...styles.curveHint, color: "#fecaca" }}>{curveError}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {tab === "tabla" && (
                    <WellsTable data={reservorioFiltrado} onSelectedPozo={(well_id) => setSelectedPozoId(well_id)} />
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

function CurveChart({ data }: { data: { date: string; oil: number | null; gas: number | null; water: number | null }[] }) {
    return (
        <div style={styles.curveChartWrapper}>
            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="oil" name="Petróleo" dot={false} connectNulls={false}/>
                        <Line type="monotone" dataKey="gas" name="Gas" dot={false} connectNulls={false}/>
                        <Line type="monotone" dataKey="water" name="Agua" dot={false} connectNulls={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
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
    },
    logo: {
        height: "100%",
        transform: "scale(1.3)",
        transformOrigin: "left center",
    },
    title: {
        fontSize: 22,
        fontWeight: 600,
        color: "#F3EEE6",
        letterSpacing: "0.5px",
    },
    topControlsRow: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    },
    main: (tab: "pozo" | "tabla") => ({
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: colors.bg
    }),
    limitFilterContainer: {
        display: "flex",
        flexDirection: "row"
    },
    wellDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        height: 560
    },
    mapContainer: {
        flex: 3,
        marginRight: 24
    },
    infoContainer: {
        flex: 1,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        marginTop: 60,
        padding: 18,
        backgroundColor: colors.panel,
        color: colors.textLight
    },
    limitLabel: {
        fontSize: 14,
        color: colors.text,
    },
    limitInput: {
        width: 120,
        padding: "6px 8px",
        borderRadius: 8,
        border: `1px solid ${colors.secondary}`,
        backgroundColor: "#fff",
    },
    legendBar: {
        position: "relative",
        top: 50,
        width: "25%",
        left: 12,
        zIndex: 10,
        display: "flex",
        flexDirection: "row",
        gap: 14,
        justifyContent: "center",
        padding: "8px 12px",
        borderRadius: 10,
        backgroundColor: "rgba(243,238,230,0.95)",
        fontSize: 13,
        color: colors.text,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    map: {
        width: "100%",
        borderRadius: 14,
    },
    markerDot: (opts: {selected: boolean; status: string}) => ({
        width: opts.selected ? 10 : 8,
        height: opts.selected ? 10 : 8,
        backgroundColor: opts.selected ? colors.accent : getPozoColor(opts.status),
        borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.3)",
        cursor: "pointer",
    }),
    popupBox: {
        backgroundColor: colors.panel,
        color: colors.textLight,
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 13,
        border: `1px solid ${colors.accent}`,
    },
    sidePanelHint: {
        opacity: 0.8,
    },
    sidePanelTitle: {
        marginBottom: 16,
        color: colors.accent,
    },
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "130px 1fr",
        rowGap: 10,
        columnGap: 12,
        fontSize: 14,
    },
    detailLabel: {
        color: colors.accent,
        fontWeight: 500,
    },
    errorMessageContainer: {
        display: "flex"
    },
    loadingContainer: {
        display: "flex"
    },
    showCurveButtonContainer: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginTop: 6,
    },
    showCurveButton: (active: boolean) => ({
        padding: "8px 10px",
        borderRadius: 10,
        border: `1px solid ${colors.accent}`,
        backgroundColor: active ? colors.accent : "transparent",
        color: active ? "#0b0b0b" : colors.accent,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
    }),
    showCurveSecondaryButton: {
        padding: "8px 10px",
        borderRadius: 10,
        border: `1px solid rgba(243,238,230,0.35)`,
        backgroundColor: "rgba(243,238,230,0.08)",
        color: "rgba(243,238,230,0.9)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
    },
    curveHint: {
        margin: 0,
        fontSize: 13,
        opacity: 0.9,
    },
    curveChartWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        color: colors.textLight,
        marginTop: 50,
    },
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