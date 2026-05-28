import {useEffect, useRef, useState} from "react";
import {ProductionMonthly} from "@/app/types";
import {DateRangeValue} from "@/utils/dateRange";
import {ProductionMonthlyResponse} from "@/app/api_client/ProductionMonthlyResponse";

interface useWellProductionParams {
    wellId: number | null,
    dateRange: DateRangeValue;
}

export function useWellsProduction({wellId, dateRange}: useWellProductionParams) {
    const [data, setData] = useState<ProductionMonthly[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previousWellId = useRef<number | null>(null);

    useEffect(() => {
        if (!wellId) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        let isCancelled = false;

        const fetchWellProduction = async () => {
            const hasWellChanged = previousWellId.current !== wellId;
            previousWellId.current = wellId;

            setLoading(true);
            setError(null);

            if (hasWellChanged) {
                setData(null);
            }

            try {
                const params = new URLSearchParams();

                if (dateRange.startYear && dateRange.startMonth) {
                    params.append("start_year", dateRange.startYear);
                    params.append("start_month", dateRange.startMonth);
                }

                if (dateRange.endYear && dateRange.endMonth) {
                    params.append("end_year", dateRange.endYear);
                    params.append("end_month", dateRange.endMonth);
                }

                const queryString = params.toString();
                const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/produccion-mensual${queryString ? `?${queryString}` : ""}`;

                const response = await fetch(url,
                    {
                        signal: controller.signal,
                        headers: {
                            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`No se pudieron cargar los datos de production del pozo ${wellId}`);
                }

                const json: ProductionMonthlyResponse = await response.json();
                setData(json.data);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setError(err instanceof Error ? err.message : "Unexpected error");
                setData(null);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchWellProduction();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [wellId, dateRange?.startYear, dateRange?.startMonth, dateRange?.endYear, dateRange?.endMonth]);
    return {data, loading, error};
}
