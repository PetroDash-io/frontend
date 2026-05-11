import React from "react";
import {WellDetail} from "@/app/types";
import Link from "next/link";

interface WellInfoProps {
    wellInfo: WellDetail | null;
    loadingWell: boolean;
    onDeselectWell?: () => void;
}

export function WellInfo({
    wellInfo,
    loadingWell,
    onDeselectWell,
}: WellInfoProps) {
    const showEmptyState = !wellInfo && !loadingWell;

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

    const formatYearMonth = (value: string | null | undefined): string | null => {
        if (!value) return null;
        const [year, month] = value.split("-");
        if (!year || !month) return null;
        return `${month.padStart(2, "0")}/${year}`;
    };

    const firstRecordLabel = formatYearMonth(wellInfo?.first_production_activity_date);
    const coverageText = firstRecordLabel || "No hay producción registrada";

    return (
        <div style={styles.infoContainer}>
            <div style={styles.cardHeader}>
                <span className="card-label">Información del pozo</span>
                <div style={styles.titleRow}>
                    <h3 style={styles.sidePanelTitle}>
                        {wellInfo ? `Pozo ${wellInfo.well_id}` : "Ningún pozo seleccionado"}
                    </h3>
                </div>
            </div>

            {showEmptyState && (
                <div style={styles.emptyState}>
                    Seleccioná un pozo en el mapa para ver su información y estado operativo.
                </div>
            )}

            {loadingWell && <p>Cargando información...</p>}

            {wellInfo && !loadingWell && (
                <>
                    <div style={styles.actionsRow}>
                        <Link href={`/analisis-pozo?wellId=${wellInfo.well_id}`} style={styles.analyzeButton}>
                            Analizar producción
                        </Link>
                        {onDeselectWell ? (
                            <button type="button" onClick={onDeselectWell} style={styles.clearSelectionButtonRow}>
                                Deseleccionar
                            </button>
                        ) : null}
                    </div>

                    <section style={styles.coverageSection}>
                        <span className="card-label">Primer registro de producción</span>
                        <p style={styles.coverageText}>{coverageText}</p>
                    </section>

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
        height: "100%",
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
    titleRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    } as React.CSSProperties,
    emptyState: {
        fontSize: 13,
        lineHeight: 1.45,
        color: "#4b5563",
        padding: "2px 0 6px",
    } as React.CSSProperties,
    section: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 18,
        padding: 12,
        borderRadius: 8,
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
        whiteSpace: "nowrap",
        minWidth: 126,
    } as React.CSSProperties,
    coverageSection: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 14,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#fff9ec",
        border: "1px solid #ebdfc6",
    } as React.CSSProperties,
    coverageText: {
        margin: 0,
        color: "var(--color-text-primary)",
        fontSize: 13,
    } as React.CSSProperties,
} as const;
