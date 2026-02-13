import { colors, MAX_POZOS} from "@/utils/constants";
import { PozoDetail } from "@/app/types";
import React, { useState } from "react";
import { useReservoirs } from "@/hooks/useReservorios";

interface WellsLimiterProps {
  setReservoirs: React.Dispatch<React.SetStateAction<PozoDetail[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function WellsLimiter({ setReservoirs, setLoading, setError}: WellsLimiterProps) {
    const [limit, setLimit] = useState(100);

    useReservoirs({ limit, setReservoirs, setLoading, setError }); /* Este Hook debería devolver los datos y estados, no recibirlos y actualizarlos. */

    return (
        <div style={styles.limitFilterContainer}>
            <label style={styles.limitLabel}>
                Cantidad de pozos:&nbsp;
                <input
                    type="number"
                    min={1}
                    max={MAX_POZOS}
                    value={limit}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!Number.isNaN(value) && value >= 1 && value <= MAX_POZOS) {
                            setLimit(value);
                        }
                    }}
                    style={styles.limitInput}
                />
            </label>
        </div>
    );
}


const styles = {
    limitFilterContainer: {
        display: "flex",
        flexDirection: "row"
    } as React.CSSProperties,
    limitLabel: {
        fontSize: 14,
        color: colors.text,
    } as React.CSSProperties,
    limitInput: {
        width: 120,
        padding: "6px 8px",
        borderRadius: 8,
        border: `1px solid ${colors.secondary}`,
        backgroundColor: "#fff",
    } as React.CSSProperties,
} as const;