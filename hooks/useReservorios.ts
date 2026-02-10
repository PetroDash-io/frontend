import { useEffect } from "react";
import { PozoDetail } from "@/app/types";

interface UseReservoirsParams {
  limit: number;
  setReservoirs: React.Dispatch<React.SetStateAction<PozoDetail[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useReservoirs({ limit, setReservoirs, setLoading, setError }: UseReservoirsParams) {

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos?limit=${limit}`;

    const fetchReservoirs = async () => {
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
            const { data } = json;

            const normalized: PozoDetail[] = Array.isArray(data) ? data : data ? [data] : [];
            setReservoirs(normalized);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    fetchReservoirs();
  }, [limit, setError, setLoading, setReservoirs]); 
}
