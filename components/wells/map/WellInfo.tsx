import React from "react";
import {colors} from "@/utils/constants";
import {WellDetail} from "@/app/types";
import {MetricsSummary, MetricsSummaryItem} from "@/components/wells/map/MetricsSummary";

interface WellInfoProps {
    wellInfo: WellDetail | null;
    loadingWell: boolean;
    metricsItems?: MetricsSummaryItem[];
    metricsLoading?: boolean;
    metricsError?: string | null;
    metricsHint?: string;
}

export function WellInfo({
    wellInfo,
    loadingWell,
    metricsItems = [],
    metricsLoading = false,
    metricsError,
    metricsHint,
}: WellInfoProps) {
    const showMetrics = !wellInfo && !loadingWell;
    const wellType = (wellInfo as (WellDetail & {type?: string}) | null)?.type ?? wellInfo?.well_type;

    return (
        <div style={styles.infoContainer}>
            {showMetrics && (
                <MetricsSummary
                    title="Métricas clave"
                    items={metricsItems}
                    loading={metricsLoading}
                    error={metricsError}
                    hint={metricsHint}
                    tone="dark"
                />
            )}
            {loadingWell && <p>Cargando información...</p>}

            {wellInfo && !loadingWell && (
                <>
                    <h3 style={styles.sidePanelTitle}>Pozo {wellInfo.well_id}</h3>

                    <dl style={styles.detailGrid}>
                        {[
                            ["Cuenca", wellInfo.watershed],
                            ["Provincia", wellInfo.province],
                            ["Área", wellInfo.area],
                            ["Empresa", wellInfo.company],
                            ["Yacimiento", wellInfo.field],
                            ["Formación", wellInfo.formation],
                            ["Clasificación", wellInfo.classification],
                            ["Tipo recurso", wellInfo.resource_type],
                            ["Tipo pozo", wellType],
                            ["Estado", wellInfo.status],
                            ["Profundidad", `${wellInfo.depth} metros`],
                        ].map(([label, value]) => (
                            <React.Fragment key={label}>
                                <dt style={styles.detailLabel}>{label}</dt>
                                <dd>{value}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </>
            )}
        </div>
    );
}


const styles = {
    infoContainer: {
        height: "100%",
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        padding: 18,
        backgroundColor: colors.panel,
        color: colors.textLight,
        overflowY: "auto",
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
    } as React.CSSProperties
} as const;
