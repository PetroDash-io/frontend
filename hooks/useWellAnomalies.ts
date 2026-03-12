import {useEffect, useRef, useState} from "react";
import {ProductionResource, WellProductionAnomalyPeriod} from "@/app/types/anomalies";

interface WellProductionDateRange {
  startYear?: string | number | null;
  startMonth?: string | number | null;
  endYear?: string | number | null;
  endMonth?: string | number | null;
}

interface UseWellAnomaliesParams {
  wellId: string | null;
  resource: ProductionResource;
  dateRange?: WellProductionDateRange;
}

const hasValue = (value?: string | number | null) => value !== undefined && value !== null && value !== "";

export function useWellAnomalies({wellId, resource, dateRange}: UseWellAnomaliesParams) {
  const [data, setData] = useState<WellProductionAnomalyPeriod[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousWellId = useRef<string | null>(null);

  useEffect(() => {
    if (!wellId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchAnomalies = async () => {
      const hasWellChanged = previousWellId.current !== wellId;
      previousWellId.current = wellId;

      setLoading(true);
      setError(null);

      if (hasWellChanged) {
        setData(null);
      }

      try {
        const params = new URLSearchParams();
        params.append("resource", resource);

        const startYear = hasValue(dateRange?.startYear) ? String(dateRange?.startYear) : null;
        const startMonth = hasValue(dateRange?.startMonth) ? String(dateRange?.startMonth) : null;
        const endYear = hasValue(dateRange?.endYear) ? String(dateRange?.endYear) : null;
        const endMonth = hasValue(dateRange?.endMonth) ? String(dateRange?.endMonth) : null;

        if (startYear && startMonth) {
          params.append("start_year", startYear);
          params.append("start_month", startMonth);
        }

        if (endYear && endMonth) {
          params.append("end_year", endYear);
          params.append("end_month", endMonth);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/anomalias-produccion?${params.toString()}`;
        const response = await fetch(url, {
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
        setError(err instanceof Error ? err.message : "Unexpected error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, [wellId, resource, dateRange?.startYear, dateRange?.startMonth, dateRange?.endYear, dateRange?.endMonth]);

  return {data, loading, error};
}
