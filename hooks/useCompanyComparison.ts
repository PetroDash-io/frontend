import { useState, useEffect } from "react";
import { CompanyComparisonResponse, ComparisonFilters } from "@/app/types";

interface UseCompanyComparisonResult {
  data: CompanyComparisonResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCompanyComparison(
  filters: Partial<ComparisonFilters>
): UseCompanyComparisonResult {
  const [data, setData] = useState<CompanyComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Solo hacer la petición si ambas empresas están seleccionadas
    if (!filters.empresa_1 || !filters.empresa_2) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // No hacer la petición si las empresas son iguales
    if (filters.empresa_1.toLowerCase().trim() === filters.empresa_2.toLowerCase().trim()) {
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
        if (filters.empresa_1) {
          params.append("empresa_1", filters.empresa_1);
        }
        if (filters.empresa_2) {
          params.append("empresa_2", filters.empresa_2);
        }
        if (filters.watershed) {
          params.append("cuenca", filters.watershed);
        }

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

        const url = `${process.env.NEXT_PUBLIC_API_URL}/empresas/produccion/comparacion?${params.toString()}`;

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
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    filters.empresa_1,
    filters.empresa_2,
    filters.watershed,
    filters.inicio_anio,
    filters.inicio_mes,
    filters.fin_anio,
    filters.fin_mes,
  ]);

  return { data, loading, error };
}
