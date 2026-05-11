import React from "react";
import {WellDetail} from "@/app/types";
import Link from "next/link";
import {MetricsSummary, MetricsSummaryItem} from "@/components/wells/map/MetricsSummary";

interface WellInfoProps {
    wellInfo: WellDetail | null;
    loadingWell: boolean;
    onDeselectWell?: () => void;
    metricsItems?: MetricsSummaryItem[];
    metricsLoading?: boolean;
    metricsError?: string | null;
    metricsHint?: string;
}

export function WellInfo({
    wellInfo,
    loadingWell,
    onDeselectWell,
    metricsItems = [],
    metricsLoading = false,
    metricsError,
    metricsHint,
}: WellInfoProps) {
    const showMetrics = !wellInfo && !loadingWell;

    const locationRows: Array<[string, string | number | null | undefined]> = wellInfo ? [
        ["ID Pozo", wellInfo.well_id],
        ["Cuenca", wellInfo.watershed],
        ["Provincia", wellInfo.province],
        ["Área", wellInfo.area],
        ["Yacimiento", wellInfo.field],
    ] : [];

    const classificationRows: Array<[string, string | number | null | undefined]> = wellInfo ? [
        ["Empresa", wellInfo.company],
        ["Formación", wellInfo.formation],
        ["Clasificación", wellInfo.classification],
        ["Tipo recurso", wellInfo.resource_type],
        ["Tipo pozo", wellInfo.well_type],
    ] : [];

    const operationRows: Array<[string, string | number | null | undefined]> = wellInfo ? [
        ["Estado", wellInfo.status],
        ["Extracción", wellInfo.extraction_type],
        ["Profundidad", `${wellInfo.depth} m`],
    ] : [];

    return (
        <div style={styles.infoContainer}>
            <div style={styles.cardHeader}>
                <span className="card-label">Detalle de pozo</span>
                <h3 style={styles.sidePanelTitle}>Pozo {wellInfo?.well_id ?? "-"}</h3>
            </div>

            {showMetrics && (
                <MetricsSummary
                    title="Métricas clave"
                    items={metricsItems}
                    loading={metricsLoading}
                    error={metricsError}
                    hint={metricsHint}
                />
            )}

            {loadingWell && <p>Cargando información...</p>}

            {wellInfo && !loadingWell && (
                <>
                    <div style={styles.actionsRow}>
                        <Link href={`/analisis-pozo?wellId=${wellInfo.well_id}`} style={styles.analyzeButton}>
                            Analizar pozo
                        </Link>
                        {onDeselectWell ? (
                            <button type="button" onClick={onDeselectWell} style={styles.clearSelectionButtonRow}>
                                Deseleccionar
                            </button>
                        ) : null}
                    </div>

                    <section style={styles.section}>
                        <span className="card-label">Ubicación</span>
                        <dl style={styles.detailGrid}>
                            {locationRows.map(([label, value]) => (
                                <React.Fragment key={label}>
                                    <dt style={styles.detailLabel}>{label}</dt>
                                    <dd style={styles.detailValue} className="mono-value">{value ?? "No informado"}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </section>

                    <section style={styles.section}>
                        <span className="card-label">Clasificación</span>
                        <dl style={styles.detailGrid}>
                            {classificationRows.map(([label, value]) => (
                                <React.Fragment key={label}>
                                    <dt style={styles.detailLabel}>{label}</dt>
                                    <dd style={styles.detailValue} className="mono-value">{value ?? "No informado"}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </section>

                    <section style={styles.section}>
                        <span className="card-label">Operación</span>
                        <dl style={styles.detailGrid}>
                            {operationRows.map(([label, value]) => (
                                <React.Fragment key={label}>
                                    <dt style={styles.detailLabel}>{label}</dt>
                                    <dd style={styles.detailValue} className="mono-value">{value ?? "No informado"}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </section>
                </>
            )}
        </div>
    );
}


const styles = {
    infoContainer: {
        height: "auto",
        maxHeight: "100%",
        minHeight: 0,
        borderRadius: "var(--radius-2xl)",
        border: "1px solid var(--color-border-subtle)",
        padding: 24,
        backgroundColor: "var(--color-surface-parchment)",
        color: "var(--color-text-primary)",
        overflowY: "auto",
        boxShadow: "var(--shadow-sm)",
    } as React.CSSProperties,
    cardHeader: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingBottom: 12,
        marginBottom: 16,
        borderBottom: "1px solid var(--color-border-subtle)",
    } as React.CSSProperties,
    sidePanelTitle: {
        margin: 0,
        color: "var(--color-brand-primary)",
        fontSize: 18,
    } as React.CSSProperties,
    section: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 18,
        padding: 12,
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-cream)",
        border: "1px solid var(--color-border-cream)",
    } as React.CSSProperties,
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "130px 1fr",
        rowGap: 8,
        columnGap: 12,
        fontSize: 13,
    } as React.CSSProperties,
    detailLabel: {
        color: "var(--color-text-label-warm)",
        fontWeight: 600,
    } as React.CSSProperties,
    detailValue: {
        margin: 0,
        color: "var(--color-text-primary)",
    } as React.CSSProperties,
    analyzeButton: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        border: "1px solid var(--color-brand-primary)",
        borderRadius: 8,
        padding: "10px 12px",
        backgroundColor: "var(--color-brand-primary)",
        color: "var(--color-text-inverse)",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
    } as React.CSSProperties,
    actionsRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
    } as React.CSSProperties,
    clearSelectionButtonRow: {
        border: "1px solid var(--color-border-medium)",
        borderRadius: 8,
        backgroundColor: "var(--color-bg-surface)",
        color: "var(--color-text-primary)",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        padding: "10px 12px",
    } as React.CSSProperties,
} as const;
