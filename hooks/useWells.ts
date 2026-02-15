import {useEffect, useState} from "react";
import {WellDetail} from "@/app/types";

interface useWellsParams {
    filters: {province: string; status: string; company: string; limit: number};
}

export function useWells({filters}: useWellsParams) {
    const [data, setData] = useState<WellDetail[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos?limit=${filters.limit}`;
    useEffect(() => {

        const fetchWells = async () => {
            setLoading(true);
            setError(null);

            try {
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
    }, [filters]);

    return {data, loading, error};
}
