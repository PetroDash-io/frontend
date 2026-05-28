import {useEffect, useState} from "react";
import {WellDetail} from "@/app/types";

interface useWellParams {
    wellId: number | null;
}

export function useWell({wellId}: useWellParams) {
    const [data, setData] = useState<WellDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!wellId) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        let isCancelled = false;
        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}`;

        const fetchWell = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url,
                    {
                        signal: controller.signal,
                        headers: {
                            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error loading well data");
                }

                const json = await response.json();
                const data = json.data;
                if (Array.isArray(data)) {
                    setData(data.length > 0 ? data[0] : null);
                } else {
                    setData(data ?? null);
                }
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchWell();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [wellId]);
    return {data, loading, error};
}
