import {useMemo} from "react";
import {useWellsHeatmap, type HeatmapResource} from "@/hooks/useWellsHeatmap";
import { WellFilters } from "@/app/types/wellFilters";

type MapHeatmapMode = "pozos" | "heatmap";

type UseMapHeatmapParams = {
  mode: MapHeatmapMode;
  resource: HeatmapResource;
  filters: WellFilters;
};

export function useMapHeatmap({mode, resource, filters}: UseMapHeatmapParams) {
  const isHeatmapMode = mode === "heatmap";

  const {geojsonData, maxValue, loading, error} = useWellsHeatmap({
    enabled: isHeatmapMode,
    resource,
    watershed: filters.watershed,
    company: filters.company,
    province: filters.province,
    status: filters.status,
    limit: filters.limit
  });

  return useMemo(
    () => {
      const mapMode: "heatmap" | "markers" = isHeatmapMode ? "heatmap" : "markers";

      return {
        isHeatmapMode,
        mapMode,
        heatmapData: isHeatmapMode ? geojsonData : null,
        heatmapMaxValue: isHeatmapMode ? maxValue : 1,
        loadingHeatmap: loading,
        errorHeatmap: error,
      };
    },
    [error, geojsonData, isHeatmapMode, loading, maxValue]
  );
}
