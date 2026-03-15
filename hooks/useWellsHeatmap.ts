import { useEffect, useState, useMemo } from "react";
import type { GeoJSON } from "geojson";

export type HeatmapResource = "oil" | "gas" | "water";

interface HeatmapFilters {
  resource: HeatmapResource;
  start_year?: number;
  start_month?: number;
  end_year?: number;
  end_month?: number;
}

interface WellHeatmapItem {
  well_id: string;
  geojson: Record<string, unknown> | string;
  total_oil: number;
  total_gas: number;
  total_water: number;
}

export function useWellsHeatmap(filters: HeatmapFilters) {
  const [rawData, setRawData] = useState<WellHeatmapItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("resource", filters.resource);
        if (filters.start_year) params.append("start_year", filters.start_year.toString());
        if (filters.start_month) params.append("start_month", filters.start_month.toString());
        if (filters.end_year) params.append("end_year", filters.end_year.toString());
        if (filters.end_month) params.append("end_month", filters.end_month.toString());

        const url = `${process.env.NEXT_PUBLIC_API_URL}/pozos/heatmap?${params.toString()}`;
        const response = await fetch(url, {
          headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "" },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        setRawData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, [filters.resource, filters.start_year, filters.start_month, filters.end_year, filters.end_month]);

  const geojsonData = useMemo<GeoJSON.FeatureCollection | null>(() => {
    if (!rawData) return null;

    const features: GeoJSON.Feature[] = [];
    for (const item of rawData) {
      try {
        const geo = typeof item.geojson === "string" ? JSON.parse(item.geojson) : item.geojson;
        if (!geo?.coordinates) continue;

        const value =
          filters.resource === "oil"
            ? item.total_oil
            : filters.resource === "gas"
            ? item.total_gas
            : item.total_water;

        features.push({
          type: "Feature",
          geometry: geo as GeoJSON.Point,
          properties: {
            well_id: item.well_id,
            value,
            total_oil: item.total_oil,
            total_gas: item.total_gas,
            total_water: item.total_water,
          },
        });
      } catch {
        /* skip wells with invalid geojson */
      }
    }

    return { type: "FeatureCollection", features };
  }, [rawData, filters.resource]);

  const maxValue = useMemo(() => {
    if (!rawData || rawData.length === 0) return 1;
    return Math.max(
      ...rawData.map((item) =>
        filters.resource === "oil"
          ? item.total_oil
          : filters.resource === "gas"
          ? item.total_gas
          : item.total_water
      )
    );
  }, [rawData, filters.resource]);

  return { geojsonData, maxValue, loading, error };
}
