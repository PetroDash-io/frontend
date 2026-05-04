import { useEffect, useState, useRef } from "react";

type Params = {
  group_by: string;
  metric: string;
  fluid: string;
};

export function useMonthlyAggregatedProduction(params: Params) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serializamos params para evitar re-renders infinitos
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!params.group_by || !params.metric || !params.fluid) return;

    setLoading(true);
    setError(null);

    const query = new URLSearchParams(params as any).toString();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/produccion/mensual-agregada?${query}`, {
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setData(data))
      .catch(() => setError("Error cargando producción agregada"))
      .finally(() => setLoading(false));

  }, [paramsKey]); // <-- string estable, no el objeto

  return { data, loading, error };
}