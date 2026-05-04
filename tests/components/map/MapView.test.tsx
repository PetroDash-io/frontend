import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {MapView} from "@/components/wells/MapView";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useMapHeatmap} from "@/hooks/useMapHeatmap";
import {useMapMetrics} from "@/hooks/useMapMetrics";

jest.mock("@/hooks/useWells", () => ({
  useWells: jest.fn(),
}));

jest.mock("@/hooks/useWell", () => ({
  useWell: jest.fn(),
}));

jest.mock("@/hooks/useMapHeatmap", () => ({
  useMapHeatmap: jest.fn(),
}));

jest.mock("@/hooks/useMapMetrics", () => ({
  useMapMetrics: jest.fn(),
}));

jest.mock("@/components/wells/map/WellsMap", () => ({
  WellsMap: ({
    onSelectWell,
    overlayControlsTopRight,
    overlayControlsBottomCenter,
  }: {
    onSelectWell: (wellId: number) => void;
    overlayControlsTopRight?: React.ReactNode;
    overlayControlsBottomCenter?: React.ReactNode;
  }) => (
    <div>
      {overlayControlsTopRight}
      {overlayControlsBottomCenter}
      <button onClick={() => onSelectWell(1)}>Select Well</button>
    </div>
  ),
}));

jest.mock("@/components/wells/common/WellInfo", () => ({
  WellInfo: ({metricsItems}: {metricsItems?: Array<{label: string}>}) => (
    <div>
      WellInfo
      {metricsItems && metricsItems.length > 0 ? <span>MetricsLoaded</span> : null}
    </div>
  ),
}));

const defaultProps = {
  filters: {
    watershed: "",
    province: "",
    status: "",
    company: "",
    limit: 0,
  },
  mode: "pozos" as const,
  onChangeMode: jest.fn(),
  selectedWellId: null,
  onSelectWell: jest.fn(),
  heatmapResource: "oil" as const,
  onSelectHeatmapResource: jest.fn(),
};

beforeEach(() => {
  (useWells as jest.Mock).mockReturnValue({
    data: [],
    loading: false,
    error: null,
  });

  (useWell as jest.Mock).mockReturnValue({
    data: null,
    loading: false,
    error: null,
  });

  (useMapHeatmap as jest.Mock).mockReturnValue({
    isHeatmapMode: false,
    mapMode: "pozos",
    heatmapData: null,
    heatmapMaxValue: 0,
  });

  (useMapMetrics as jest.Mock).mockReturnValue({
    data: null,
    loading: false,
    error: null,
  });
});

describe("MapView", () => {
  it("muestra controles de recurso en modo heatmap", () => {
    (useMapHeatmap as jest.Mock).mockReturnValue({
      isHeatmapMode: true,
      mapMode: "heatmap",
      heatmapData: null,
      heatmapMaxValue: 0,
    });

    render(<MapView {...defaultProps} mode="heatmap" />);

    expect(screen.getByText("Petróleo")).toBeInTheDocument();
    expect(screen.getByText("Gas")).toBeInTheDocument();
    expect(screen.getByText("Agua")).toBeInTheDocument();
  });

  it("no muestra controles en modo pozos", () => {
    render(<MapView {...defaultProps} mode="pozos" />);
    expect(screen.queryByText("Petróleo")).not.toBeInTheDocument();
  });

  it("permite cambiar la visualización desde el dock", () => {
    const onChangeMode = jest.fn();
    render(<MapView {...defaultProps} mode="pozos" onChangeMode={onChangeMode} />);

    fireEvent.click(screen.getByText("Heatmap"));
    expect(onChangeMode).toHaveBeenCalledWith("heatmap");
  });

  it("llama onSelectHeatmapResource al seleccionar recurso", () => {
    const onSelectHeatmapResource = jest.fn();
    (useMapHeatmap as jest.Mock).mockReturnValue({
      isHeatmapMode: true,
      mapMode: "heatmap",
      heatmapData: null,
      heatmapMaxValue: 0,
    });

    render(
      <MapView
        {...defaultProps}
        mode="heatmap"
        onSelectHeatmapResource={onSelectHeatmapResource}
      />
    );

    fireEvent.click(screen.getByText("Gas"));
    expect(onSelectHeatmapResource).toHaveBeenCalledWith("gas");
  });

  it("renderiza WellInfo y permite seleccionar pozo", () => {
    const onSelectWell = jest.fn();
    render(<MapView {...defaultProps} mode="pozos" onSelectWell={onSelectWell} />);

    expect(screen.getByText("WellInfo")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Select Well"));
    expect(onSelectWell).toHaveBeenCalledWith(1);
    expect(screen.getByText("WellInfo")).toBeInTheDocument();
  });

  it("pasa métricas a WellInfo cuando hay datos iniciales", () => {
    (useMapMetrics as jest.Mock).mockReturnValue({
      data: {
        source: "db",
        resource: "oil",
        active_wells: 10,
        stopped_wells: 2,
        inactive_wells: 1,
        not_informed_wells: 0,
        total_production_last_month: 12345,
        last_month: "2024-01-01",
      },
      loading: false,
      error: null,
    });

    render(<MapView {...defaultProps} mode="pozos" />);

    expect(screen.getByText("MetricsLoaded")).toBeInTheDocument();
  });

  it("muestra mensaje de error si falla useWells", () => {
    (useWells as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: "Error cargando pozos",
    });

    render(<MapView {...defaultProps} mode="pozos" />);
    expect(screen.getByText("Error cargando pozos")).toBeInTheDocument();
  });

  it("muestra loading mientras carga wells", () => {
    (useWells as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<MapView {...defaultProps} mode="pozos" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
