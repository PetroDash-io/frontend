import { useState, useEffect } from "react";
import { TopProductionResponse, TopProductionFilters } from "@/app/types";

interface UseTopProductionResult {
  data: TopProductionResponse | null;
  loading: boolean;
  error: string | null;
}

export function useTopProduction(filters: Partial<TopProductionFilters>): UseTopProductionResult {
  const [data, setData] = useState<TopProductionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if tipo is provided (required parameter)
    if (!filters.tipo) {
      setData(null);
      return;
    }

    const fetchTopProduction = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("tipo", filters.tipo!);

        if (filters.provincia) {
          params.append("provincia", filters.provincia);
        }

        if (filters.area) {
          params.append("area", filters.area);
        }

        if (filters.inicio_anio !== undefined) {
          params.append("inicio_anio", filters.inicio_anio.toString());
          if (filters.inicio_mes !== undefined) {
            params.append("inicio_mes", filters.inicio_mes.toString());
          }
        }

        if (filters.fin_anio !== undefined) {
          params.append("fin_anio", filters.fin_anio.toString());
          if (filters.fin_mes !== undefined) {
            params.append("fin_mes", filters.fin_mes.toString());
          }
        }

        if (filters.limit !== undefined) {
          params.append("limit", filters.limit.toString());
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/empresas/produccion/top?${params.toString()}`;

        const response = await fetch(url, {
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProduction();
  }, [
    filters.tipo,
    filters.provincia,
    filters.area,
    filters.inicio_anio,
    filters.inicio_mes,
    filters.fin_anio,
    filters.fin_mes,
    filters.limit,
  ]);

  return { data, loading, error };
}
