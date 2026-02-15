import { useState, useEffect } from "react";
import { WellProductionComparisonResponse, WellProductionComparisonFilters } from "@/app/types";

interface UseWellProductionComparisonResult {
  data: WellProductionComparisonResponse | null;
  loading: boolean;
  error: string | null;
}

export function useWellProductionComparison(
  wellId: number | null,
  filters: Partial<WellProductionComparisonFilters>
): UseWellProductionComparisonResult {
  const [data, setData] = useState<WellProductionComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Solo hacer la petición si tenemos un wellId
    if (!wellId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.inicio_anio !== undefined) {
          params.append("inicio_anio", filters.inicio_anio.toString());
        }
        if (filters.inicio_mes !== undefined) {
          params.append("inicio_mes", filters.inicio_mes.toString());
        }
        if (filters.fin_anio !== undefined) {
          params.append("fin_anio", filters.fin_anio.toString());
        }
        if (filters.fin_mes !== undefined) {
          params.append("fin_mes", filters.fin_mes.toString());
        }
        if (filters.median_by && filters.median_by.length > 0) {
          filters.median_by.forEach(value => {
            params.append("median_by", value);
          });
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/comparacion-produccion?${params.toString()}`;

        const response = await fetch(url, {
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result: WellProductionComparisonResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wellId, filters.inicio_anio, filters.inicio_mes, filters.fin_anio, filters.fin_mes, JSON.stringify(filters.median_by)]);

  return { data, loading, error };
}
