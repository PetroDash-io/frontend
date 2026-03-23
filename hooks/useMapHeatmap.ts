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

  const {geojsonData, maxValue} = useWellsHeatmap({
    resource,
    watershed: filters.watershed,
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
      };
    },
    [geojsonData, isHeatmapMode, maxValue]
  );
}
