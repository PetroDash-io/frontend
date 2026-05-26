import {useEffect, useState} from "react";
import {MapMetricsResponse} from "@/app/types";
import {WellFilters} from "@/app/types/wellFilters";
import {buildWellFilterParams} from "@/utils/wellParams";

interface UseMapMetricsResult {
  data: MapMetricsResponse | null;
  loading: boolean;
  error: string | null;
}

export function useMapMetrics(filters: WellFilters): UseMapMetricsResult {
  const [data, setData] = useState<MapMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filters.watershed) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = buildWellFilterParams(filters);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/resumen-mapa?${params.toString()}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        setData(json as MapMetricsResponse);
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

    fetchMetrics();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [filters.watershed, filters.company, filters.province, filters.status, filters.classification]);

  return {data, loading, error};
}
