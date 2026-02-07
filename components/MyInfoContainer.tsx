import {ProductionMonthlyResponse} from "@/app/api_client/ProductionMonthlyResponse";
import { PozoDetail, ProductionMonthly } from "@/app/types";
import { colors } from "@/utils/constants";

import React, { useState, useEffect } from "react";

interface MyInfoContainerProps {
    selectedPozoId: string | null;
    showCurve: boolean;
    curveData: ProductionMonthly[] | null;

    onShowCurve: (show: boolean) => void;
    onCurveData: (data: ProductionMonthly[] | null) => void;
}

export function MyInfoContainer({ selectedPozoId, showCurve, curveData, onShowCurve, onCurveData }: MyInfoContainerProps) {

    const [pozoDetail, setPozoDetail] = useState<PozoDetail | null>(null);
    const [loadingPozo, setLoadingPozo] = useState(false);
    const [curveLoading, setCurveLoading] = useState(false);
    const [curveError, setCurveError] = useState<string | null>(null);

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
        onShowCurve(false);
        setCurveLoading(false);
        setCurveError(null);
        onCurveData(null);
    }, [selectedPozoId, onShowCurve, onCurveData]);

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

            onCurveData(rows);
        } catch (error) {
            onCurveData(null);
            setCurveError(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setCurveLoading(false);
        }
    }

    function onToggleCurve() {
        if (!selectedPozoId) return;

        if (!showCurve) {
            onShowCurve(true);
            if (!curveData && !curveLoading) {
                fetchProductionForSelectedWell(selectedPozoId);
            }
            return;
        }

        onShowCurve(false);
    }

    return (
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
                            title={!selectedPozoId ? "Seleccioná un pozo" : "Ver curva de vida"}>
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
    );
}


const styles = {
    infoContainer: {
        flex: 1,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        marginTop: 60,
        padding: 18,
        backgroundColor: colors.panel,
        color: colors.textLight
    } as React.CSSProperties,
    sidePanelHint: {
        opacity: 0.8,
    } as React.CSSProperties,
    sidePanelTitle: {
        marginBottom: 16,
        color: colors.accent,
    } as React.CSSProperties,
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "130px 1fr",
        rowGap: 10,
        columnGap: 12,
        fontSize: 14,
    } as React.CSSProperties,
    detailLabel: {
        color: colors.accent,
        fontWeight: 500,
    } as React.CSSProperties,
    showCurveButtonContainer: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginTop: 6,
    } as React.CSSProperties,
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
    }) as React.CSSProperties,
    showCurveSecondaryButton: {
        padding: "8px 10px",
        borderRadius: 10,
        border: `1px solid rgba(243,238,230,0.35)`,
        backgroundColor: "rgba(243,238,230,0.08)",
        color: "rgba(243,238,230,0.9)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
    } as React.CSSProperties,
    curveHint: {
        margin: 0,
        fontSize: 13,
        opacity: 0.9,
    } as React.CSSProperties,
} as const;