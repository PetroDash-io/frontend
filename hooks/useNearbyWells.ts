import { useEffect, useState } from "react";

type NearbyWell = {
  well_id: number;
  company: string;
  area: string;
  province: string;
  well_type: string;
  geojson: {
    type: string;
    coordinates: [number, number];
  };
  distance: number;
};

export function useNearbyWells({ wellId, radius = 500 }: { wellId: number | null; radius?: number }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/${wellId}/cercanos?radius=${radius}`;
  
    useEffect(() => {
      if (!wellId) return;
  
      setLoading(true);
      setError(null);
  
      fetch(url, {
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching nearby wells");
          return res.json();
        })
        .then((json) => {
          setData(json.data || []);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [wellId, radius]);
  
    return { data, loading, error };
  }