import React from "react";

export type SelectFilterOption = {
    value: string | number;
    label: string;
}

interface FilterProps {
    value: string | number;
    onSelect: (filterName: string, value: string) => void;
    filterName: string;
    options: SelectFilterOption[] | string[] | number[];
    inputLabel?: string
    defaultOptionLabel?: string;
    disabled?: boolean;
    hasError?: boolean;
}

export const SELECT_DEFAULT_VALUE = "";

export const SelectFilter = ({
                                 value,
                                 onSelect,
                                 filterName,
                                 options,
                                 inputLabel,
                                 defaultOptionLabel,
                                 disabled = false,
                                 hasError = false
                             }: FilterProps) => {
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(filterName, event.target.value);
    }

    return (
        <div style={styles.filterGroup}>
            <label style={styles.label}>
                {inputLabel || ""}
                <select
                    value={value}
                    onChange={onChange}
                    className="select-filter"
                    style={{ ...styles.select, ...(hasError ? styles.selectError : {}) }}
                    disabled={disabled}>
                    {defaultOptionLabel ? <option value={""}>{defaultOptionLabel}</option> : null}
                    {options.map(item => {
                        if (typeof item === "object") {
                            return <option key={item.value} value={item.value}>{item.label}</option>
                        }
                        return <option key={item} value={item}>{item}</option>
                    })}
                </select>
            </label>
        </div>
    )
}

const styles = {
    filterGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 220,
        flex: 1,
    } as React.CSSProperties,
    label: {
        fontSize: 13,
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
    } as React.CSSProperties,
    select: {
        padding: "10px 14px",
        borderRadius: 6,
        border: "1px solid var(--color-border-medium)",
        backgroundColor: "var(--color-bg-sunken)",
        fontSize: 13,
        color: "var(--color-text-primary)",
        cursor: "pointer",
        minWidth: 200,
        height: "40px",
    } as React.CSSProperties,
    selectError: {
        borderColor: "var(--color-error)",
        boxShadow: "0 0 0 1px var(--color-error)",
    } as React.CSSProperties,
}
