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
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties,
    buttonStyle(isActive: boolean): React.CSSProperties {
        return {
            padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #3F6B4F",
                backgroundColor: isActive ? "#3F6B4F" : "transparent",
                color: isActive ? "#F3EEE6" : "#3F6B4F",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
        }
    }
};