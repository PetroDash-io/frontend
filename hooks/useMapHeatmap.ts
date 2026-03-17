import {useMemo} from "react";
import {useWellsHeatmap, type HeatmapResource} from "@/hooks/useWellsHeatmap";

type MapHeatmapMode = "pozos" | "heatmap";

type UseMapHeatmapParams = {
  mode: MapHeatmapMode;
  resource: HeatmapResource;
};

export function useMapHeatmap({mode, resource}: UseMapHeatmapParams) {
  const isHeatmapMode = mode === "heatmap";

  const {geojsonData, maxValue} = useWellsHeatmap({
    resource,
    enabled: isHeatmapMode,
  });

  return useMemo(
    () => ({
      isHeatmapMode,
      mapMode: isHeatmapMode ? "heatmap" : "markers" as const,
      heatmapData: isHeatmapMode ? geojsonData : null,
      heatmapMaxValue: isHeatmapMode ? maxValue : 1,
    }),
    [geojsonData, isHeatmapMode, maxValue]
  );
}
