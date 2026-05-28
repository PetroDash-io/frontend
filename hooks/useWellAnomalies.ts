import {useEffect, useRef, useState} from "react";
import {ProductionResource, WellProductionAnomalyPeriod} from "@/app/types/anomalies";
import {DateRangeValue} from "@/utils/dateRange";

interface UseWellAnomaliesParams {
  wellId: number | null;
  resource: ProductionResource;
  dateRange: DateRangeValue;
}

export function useWellAnomalies({wellId, resource, dateRange}: UseWellAnomaliesParams) {
  const [data, setData] = useState<WellProductionAnomalyPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousWellId = useRef<number | null>(null);

  useEffect(() => {
    if (!wellId) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    const fetchAnomalies = async () => {
      const hasWellChanged = previousWellId.current !== wellId;
      previousWellId.current = wellId;

      setLoading(true);
      setError(null);

      if (hasWellChanged) {
        setData([]);
      }

      try {
        const params = new URLSearchParams();
        params.append("resource", resource);

        if (dateRange.startYear && dateRange.startMonth) {
          params.append("start_year", dateRange.startYear);
          params.append("start_month", dateRange.startMonth);
        }

        if (dateRange.endYear && dateRange.endMonth) {
          params.append("end_year", dateRange.endYear);
          params.append("end_month", dateRange.endMonth);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/anomalias-produccion?${params.toString()}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar anomalias de produccion del pozo ${wellId}`);
        }

        const json = await response.json();
        setData(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Unexpected error");
        setData([]);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnomalies();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [wellId, resource, dateRange.startYear, dateRange.startMonth, dateRange.endYear, dateRange.endMonth]);

  return {data, loading, error};
}
