import {useEffect, useState} from "react";
import {ProductionMonthly} from "@/app/types";

interface useWellProductionParams {
    wellId: string | null;
}

export function useWellsProduction({wellId}: useWellProductionParams) {
    const [data, setData] = useState<ProductionMonthly[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/produccion-mensual`;
    useEffect(() => {
        if (!wellId) return;

        const fetchWellProduction = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url,
                    {
                        headers: {
                            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error al cargar los datos de production del pozo ${wellId}`);
                }

                const json = await response.json();
                setData(json.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchWellProduction();
    }, [wellId]);
    return {data, loading, error};
}
