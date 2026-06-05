import { useState, useEffect } from "react";
import { WellProductionComparisonResponse, WellProductionComparisonFilters } from "@/app/types";
import {DateRangeValue} from "@/utils/dateRange";

interface UseWellProductionComparisonResult {
  data: WellProductionComparisonResponse | null;
  loading: boolean;
  error: string | null;
}

export function useWellProductionComparison(
  wellId: number | null,
  filters: Partial<WellProductionComparisonFilters>,
  dateRange: DateRangeValue
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

    const controller = new AbortController();
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (dateRange.startYear) {
          params.append("inicio_anio", dateRange.startYear.toString());
        }
        if (dateRange.startMonth) {
          params.append("inicio_mes", dateRange.startMonth.toString());
        }
        if (dateRange.endYear) {
          params.append("fin_anio", dateRange.endYear.toString());
        }
        if (dateRange.endMonth) {
          params.append("fin_mes", dateRange.endMonth.toString());
        }
        if (filters.median_by && filters.median_by.length > 0) {
          filters.median_by.forEach(value => {
            params.append("median_by", value);
          });
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/comparacion-produccion?${params.toString()}`;

        const response = await fetch(url, {
          signal: controller.signal,
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

    fetchData();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [wellId, dateRange, filters]);

  return { data, loading, error };
}
