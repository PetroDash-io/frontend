import {useEffect, useState} from "react";
import {WellDetail} from "@/app/types";

interface useWellsParams {
    filters: {watershed: string, province: string; status: string; company: string; limit: number};
}

export function useWells({filters}: useWellsParams) {
    const [data, setData] = useState<WellDetail[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWells = async () => {
            setLoading(true);
            setError(null);

            try {
                // Construir query params incluyendo filtros
                const params = new URLSearchParams();
                params.append('limit', filters.limit.toString());

                if (filters.watershed) {
                    params.append('watershed', filters.watershed);
                }

                if (filters.company) {
                    params.append('company', filters.company);
                }
                if (filters.province) {
                    params.append('province', filters.province);
                }
                if (filters.status) {
                    params.append('status', filters.status);
                }

                const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos?${params.toString()}`;

                const response = await fetch(url, {
                    headers: {
                        "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const json = await response.json();
                setData(json.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchWells();
    }, [filters.limit, filters.watershed, filters.company, filters.province, filters.status]);

    return {data, loading, error};
}
