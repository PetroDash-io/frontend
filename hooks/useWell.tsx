import {useEffect, useState} from "react";
import {WellDetail} from "@/app/types";

interface useWellParams {
    wellId: string | null;
}

export function useWell({wellId}: useWellParams) {
    const [data, setData] = useState<WellDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}`;
    useEffect(() => {
        console.log("Fetching well details for ID:", wellId);
        if (!wellId) return;

        const fetchWell = async () => {
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
                    throw new Error("Error loading well data");
                }

                const json = await response.json();
                const data = json.data;
                console.log("Received well details response:", data);
                setData(Array.isArray(data) && data.length > 0 ? data[0] : null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchWell();
    }, [wellId]);
    return {data, loading, error};
}
