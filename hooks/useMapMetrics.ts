import {useEffect, useState} from "react";
import {MapMetricsResponse} from "@/app/types";
import {WellFilters} from "@/app/types/wellFilters";
import type {HeatmapResource} from "@/hooks/useWellsHeatmap";

interface UseMapMetricsResult {
  data: MapMetricsResponse | null;
  loading: boolean;
  error: string | null;
}

export function useMapMetrics(filters: WellFilters, resource: HeatmapResource = "oil"): UseMapMetricsResult {
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

    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("watershed", filters.watershed);

        if (filters.company) {
          params.append("company", filters.company);
        }

        if (filters.province) {
          params.append("province", filters.province);
        }

        if (filters.status) {
          params.append("status", filters.status);
        }

        if (resource) {
          params.append("resource", resource);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/resumen-mapa?${params.toString()}`;
        const response = await fetch(url, {
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
        setError(err instanceof Error ? err.message : "Unexpected error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filters.watershed, filters.company, filters.province, filters.status, resource]);

  return {data, loading, error};
}
