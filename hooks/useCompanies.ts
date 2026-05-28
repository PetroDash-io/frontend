import { useState, useEffect } from "react";
import { Company } from "@/app/types";

interface UseCompaniesResult {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

type RawCompany = {
  empresa?: string;
  company?: string;
  name?: string;
  cantidad_pozos?: number;
  wells_count?: number;
  count?: number;
  cantidad?: number;
};

export function useCompanies(searchQuery?: string, watershed = "NEUQUINA"): UseCompaniesResult {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("watershed", watershed);
        if (searchQuery) {
          params.append("q", searchQuery);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/empresas${params.toString() ? `?${params.toString()}` : ""}`;
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = (await response.json()) as {data?: unknown};
        const responseData = json.data;

        const rawArray: unknown[] = Array.isArray(responseData)
          ? responseData
          : responseData != null
          ? [responseData]
          : [];

        const normalized: Company[] = rawArray.map((item) => {
          const candidate: RawCompany =
            typeof item === "object" && item !== null ? (item as RawCompany) : {};

          return {
            empresa: candidate.empresa ?? candidate.company ?? candidate.name ?? "",
            cantidad_pozos:
              candidate.cantidad_pozos ??
              candidate.wells_count ??
              candidate.count ??
              candidate.cantidad ??
              0,
          };
        });

        setCompanies(normalized);
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

    fetchCompanies();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [searchQuery, watershed]);

  return { companies, loading, error };
}
