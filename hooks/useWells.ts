import {useEffect, useState} from "react";
import {WellDetail} from "@/app/types";
import {WellFilters} from "@/app/types/wellFilters";

interface useWellsParams {
    filters: WellFilters;
    offset?: number;
    enabled?: boolean;
}

type WellsResponse = {
    total?: number;
    limit?: number;
    offset?: number;
    data?: WellDetail[];
};

type WellsPagination = {
    total: number;
    limit: number;
    offset: number;
};

export function useWells({filters, offset, enabled = true}: useWellsParams) {
    const [data, setData] = useState<WellDetail[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<WellsPagination | null>(null);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        let isCancelled = false;

        const fetchWells = async () => {
            setLoading(true);
            setError(null);
            setData(null);

            try {
                // Construir query params incluyendo filtros
                const params = new URLSearchParams();
                params.append('limit', filters.limit.toString());
                if (offset !== undefined) {
                    params.append('offset', offset.toString());
                }
                params.append('watershed', filters.watershed);

                if (filters.company) {
                    params.append('company', filters.company);
                }
                if (filters.province) {
                    params.append('province', filters.province);
                }
                if (filters.status) {
                    params.append('status', filters.status);
                }
                if (filters.classification === "conv") {
                    params.append("resource_type", "CONVENCIONAL");
                }
                if (filters.classification === "no_conv") {
                    params.append("resource_type", "NO CONVENCIONAL");
                }

                const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos?${params.toString()}`;

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const json = await response.json() as WellsResponse;
                setData(Array.isArray(json.data) ? json.data : []);

                const responseLimit = typeof json.limit === "number" ? json.limit : filters.limit;
                const responseOffset = typeof json.offset === "number" ? json.offset : offset ?? 0;
                const responseTotal = typeof json.total === "number" ? json.total : 0;

                setPagination({
                    total: responseTotal,
                    limit: responseLimit,
                    offset: responseOffset,
                });
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setError(err instanceof Error ? err.message : "Unexpected error");
                setPagination(null);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchWells();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [enabled, filters.limit, filters.watershed, filters.company, filters.province, filters.status, filters.classification, offset]);

    return {data, loading, error, pagination};
}
