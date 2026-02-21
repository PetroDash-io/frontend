import React from "react";
import {colors} from "@/utils/constants";

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
}

export const SELECT_DEFAULT_VALUE = "";
const SELECT_DEFAULT_TEXT = "Seleccionar";

export const SelectFilter = ({
                                 value,
                                 onSelect,
                                 filterName,
                                 options,
                                 inputLabel,
                                 defaultOptionLabel = SELECT_DEFAULT_TEXT,
                                 disabled = false
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
                    disabled={disabled}>
                    <option value={""}>{defaultOptionLabel}</option>
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
    } as React.CSSProperties,
    label: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.text,
        display: "flex",
        flexDirection: "column",
        gap: 6,
    } as React.CSSProperties,
    select: {
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${colors.secondary}`,
        backgroundColor: "#fff",
        fontSize: 14,
        color: colors.text,
        cursor: "pointer",
    } as React.CSSProperties,
}