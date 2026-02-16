import React from "react";
import {colors} from "@/utils/constants";
import {WellDetail} from "@/app/types";

interface WellInfoProps {
    wellInfo: WellDetail | null;
    loadingWell: boolean;
}

export function WellInfo({wellInfo, loadingWell}: WellInfoProps) {
    return (
        <div style={styles.infoContainer}>
            {!wellInfo && <p style={styles.sidePanelHint}>Seleccioná un pozo en el mapa</p>}
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
                            ["Tipo pozo", wellInfo.type],
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
    } as React.CSSProperties
} as const;