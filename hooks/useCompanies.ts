import { useState, useEffect } from "react";
import { Company } from "@/app/types";

interface UseCompaniesResult {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

export function useCompanies(searchQuery?: string): UseCompaniesResult {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append("q", searchQuery);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/empresas${params.toString() ? `?${params.toString()}` : ""}`;
        
        const response = await fetch(url, {
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        const { data } = json;

        console.log("Companies API response:", json);
        console.log("Companies data:", data);

        const normalized: Company[] = Array.isArray(data) ? data : data ? [data] : [];
        console.log("Normalized companies:", normalized);
        setCompanies(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchQuery]);

  return { companies, loading, error };
}
