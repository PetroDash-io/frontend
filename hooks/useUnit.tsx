import {useState} from "react";
import {UNITS} from "@/utils/units";

export function useUnit() {
    const [unit, setUnit] = useState<string>(UNITS.m3);
    return {unit, setUnit};
}