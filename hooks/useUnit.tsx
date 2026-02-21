import React from "react";
import {UNITS} from "@/utils/units";


export function useUnit() {
    const [unit, setUnit] = React.useState<string>(UNITS.m3);
    return {unit, setUnit};
}