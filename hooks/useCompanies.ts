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
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchQuery, watershed]);

  return { companies, loading, error };
}
