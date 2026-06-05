import React from "react";
import {WellFilters} from "@/app/types/wellFilters";
import {SelectFilter} from "@/components/common/SelectFilter";
import {ClassificationFilter} from "@/components/wells/common/ClassificationFilter";
import {LimitFilter} from "@/components/wells/common/LimitFilter";
import {WATERSHED_OPTIONS} from "@/utils/constants";

interface WellsFilterPanelProps {
    filters: WellFilters;
    onUpdate: (filterName: string, value: unknown) => void;
    provinceOptions: string[];
    statusOptions: string[];
    companyOptions: string[];
}

export function WellsFilterPanel({filters, onUpdate, provinceOptions, statusOptions, companyOptions}: WellsFilterPanelProps) {
    return (
        <div style={styles.panel}>
            <div style={styles.item}>
                <SelectFilter
                    filterName="watershed"
                    value={filters.watershed}
                    onSelect={onUpdate}
                    options={WATERSHED_OPTIONS}
                    inputLabel="Cuenca"
                />
            </div>
            <div style={styles.item}>
                <SelectFilter
                    filterName="province"
                    value={filters.province}
                    onSelect={onUpdate}
                    options={provinceOptions}
                    defaultOptionLabel="Todas las provincias"
                    inputLabel="Provincia"
                />
            </div>
            <div style={styles.item}>
                <SelectFilter
                    filterName="status"
                    value={filters.status}
                    onSelect={onUpdate}
                    options={statusOptions}
                    defaultOptionLabel="Todos los estados"
                    inputLabel="Estado"
                />
            </div>
            <div style={styles.item}>
                <SelectFilter
                    filterName="company"
                    value={filters.company}
                    onSelect={onUpdate}
                    options={companyOptions}
                    defaultOptionLabel="Todas las empresas"
                    inputLabel="Empresa"
                />
            </div>
            <div style={styles.classificationItem}>
                <ClassificationFilter
                    value={filters.classification}
                    onChange={(v) => onUpdate("classification", v)}
                />
            </div>
            <div style={styles.item}>
                <LimitFilter
                    filterName="limit"
                    limit={filters.limit}
                    onDefineLimit={onUpdate}
                />
            </div>
        </div>
    );
}

const styles = {
    panel: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: 16,
        padding: "16px",
        marginBottom: 18,
        borderRadius: "var(--radius-2xl)",
        border: "1px solid var(--color-brand-subtle)",
        backgroundColor: "var(--color-surface-glass)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
        overflow: "hidden",
    } as React.CSSProperties,
    item: {
        flex: "1 1 110px",
        minWidth: 0,
    } as React.CSSProperties,
    classificationItem: {
        flex: "0 0 auto",
    } as React.CSSProperties,
} as const;
