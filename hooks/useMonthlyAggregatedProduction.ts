import {useEffect, useState} from "react";

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
    const controller = new AbortController();
    let isCancelled = false;

    const query = new URLSearchParams(params as any).toString();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/produccion/mensual-agregada?${query}`, {
        signal: controller.signal,
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError("Error cargando producción agregada");
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };

  }, [paramsKey]); // <-- string estable, no el objeto

  return { data, loading, error };
}
