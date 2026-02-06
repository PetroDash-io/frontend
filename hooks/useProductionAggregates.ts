import { useState, useEffect } from "react";
import { ProductionAggregates, ProductionAggregatesFilters } from "@/app/types";

interface UseProductionAggregatesResult {
  data: ProductionAggregates | null;
  loading: boolean;
  error: string | null;
}

export function useProductionAggregates(filters: ProductionAggregatesFilters): UseProductionAggregatesResult {
  const [data, setData] = useState<ProductionAggregates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if at least empresa or date filters are provided
    if (!filters.empresa && !filters.inicio_anio && !filters.fin_anio) {
      setData(null);
      return;
    }

    const fetchProduction = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.empresa) {
          params.append("empresa", filters.empresa);
        }

        if (filters.inicio_anio) {
          params.append("inicio_anio", filters.inicio_anio.toString());
          if (filters.inicio_mes) {
            params.append("inicio_mes", filters.inicio_mes.toString());
          }
        }

        if (filters.fin_anio) {
          params.append("fin_anio", filters.fin_anio.toString());
          if (filters.fin_mes) {
            params.append("fin_mes", filters.fin_mes.toString());
          }
        }
        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/produccion?${params.toString()}`;
        
        const response = await fetch(url, {
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduction();
  }, [filters.empresa, filters.inicio_anio, filters.inicio_mes, filters.fin_anio, filters.fin_mes]);

  return { data, loading, error };
}
