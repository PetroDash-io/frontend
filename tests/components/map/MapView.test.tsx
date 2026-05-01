import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {MapView} from "@/components/map/MapView";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useMapHeatmap} from "@/hooks/useMapHeatmap";

jest.mock("@/hooks/useWells", () => ({
  useWells: jest.fn(),
}));

jest.mock("@/hooks/useWell", () => ({
  useWell: jest.fn(),
}));

jest.mock("@/hooks/useMapHeatmap", () => ({
  useMapHeatmap: jest.fn(),
}));

jest.mock("@/components/map/WellsMap", () => ({
  WellsMap: ({onSelectWell}: {onSelectWell: (wellId: number) => void}) => (
    <button onClick={() => onSelectWell(1)}>Select Well</button>
  ),
}));

jest.mock("@/components/map/WellInfo", () => ({
  WellInfo: () => <div>WellInfo</div>,
}));

jest.mock("@/components/map/MapHeatmapControls", () => ({
  MapHeatmapControls: ({selectedResource, onSelectResource}: {selectedResource: string; onSelectResource: (resource: "oil" | "gas" | "water") => void}) => (
    <div>
      <span>{selectedResource}</span>
      <button onClick={() => onSelectResource("oil")}>Petróleo</button>
      <button onClick={() => onSelectResource("gas")}>Gas</button>
      <button onClick={() => onSelectResource("water")}>Agua</button>
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
    render(<MapView {...defaultProps} mode="pozos" />);

    expect(screen.getByText("WellInfo")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Select Well"));
    expect(screen.getByText("WellInfo")).toBeInTheDocument();
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
