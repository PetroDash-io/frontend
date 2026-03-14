import React from "react";
import {UNITS} from "@/utils/units";


interface UnitTabsProps {
    onChange: React.Dispatch<React.SetStateAction<string>>;
    currentUnit: string;
}

export const UnitTabs = ({onChange, currentUnit}: UnitTabsProps) => {
    const onChangeUnit = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedUnit = event.currentTarget.textContent;
        onChange(selectedUnit);
    }

    return (
        <div role="tablist" style={style.buttonsContainer}>
            <button style={style.buttonStyle(currentUnit === UNITS.m3)} onClick={onChangeUnit}>
                {UNITS.m3}
            </button>

            <button style={style.buttonStyle(currentUnit === UNITS.bbl)} onClick={onChangeUnit}>
                {UNITS.bbl}
            </button>
        </div>
    );
}

const style = {
    buttonsContainer: {
        display: "flex",
        gap: 6,
        padding: "4px",
        width: "fit-content",
        border: "1px solid #d8cdbf",
        borderRadius: 10,
        backgroundColor: "#faf8f3",
    } as React.CSSProperties,
    buttonStyle(isActive: boolean): React.CSSProperties {
        return {
            padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${isActive ? "#c9d8ce" : "transparent"}`,
                backgroundColor: isActive ? "#e9f0eb" : "transparent",
                color: isActive ? "#2f3e34" : "#4b2a1a",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
        }
    }
};
