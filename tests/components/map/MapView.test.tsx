import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MapView } from "../../../components/map/MapView";

// hooks
import { useWells } from "@/hooks/useWells";
import { useWell } from "@/hooks/useWell";
import { useWellsProduction } from "@/hooks/useWellProduction";
import { useWellsHeatmap } from "@/hooks/useWellsHeatmap";


// mockeo de hooks

jest.mock("@/hooks/useWells", () => ({
    useWells: jest.fn(),
}));
  
jest.mock("@/hooks/useWell", () => ({
    useWell: jest.fn(),
}));
  
jest.mock("@/hooks/useWellProduction", () => ({
    useWellsProduction: jest.fn(),
}));
  
jest.mock("@/hooks/useWellsHeatmap", () => ({
    useWellsHeatmap: jest.fn(),
}));

// mockear componentes hijos:

jest.mock("@/components/map/WellsMap", () => ({
    WellsMap: ({ onSelectWell }: any) => (
      <button onClick={() => onSelectWell("well-1")}>
        Select Well
      </button>
    ),
}));
  
jest.mock("@/components/map/WellInfo", () => ({
    WellInfo: () => <div>WellInfo</div>,
}));
  
jest.mock("@/components/map/ProductionPanel", () => ({
    ProductionPanel: () => <div>ProductionPanel</div>,
    EMPTY_VALIDATED_RANGE: {},
}));
  
jest.mock("@/components/map/anomalies/WellAnomaliesPanel", () => ({
    WellAnomaliesPanel: () => <div>Anomalies</div>,
}));



// default mocks antes de cada test
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
  
    (useWellsProduction as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });
  
    (useWellsHeatmap as jest.Mock).mockReturnValue({
      geojsonData: null,
      maxValue: 0,
    });
  });
  
  const defaultProps = {
    filters: {
      watershed: "",
      province: "",
      status: "",
      company: "",
      limit: 0,
    },
    heatmapResource: "oil" as const,
    onSelectHeatmapResource: jest.fn(),
  };
  
  describe("MapView", () => {
    it("muestra botones de recursos en modo heatmap", () => {
      render(<MapView {...defaultProps} mode="heatmap" />);
  
      expect(screen.getByText("Petróleo")).toBeInTheDocument();
      expect(screen.getByText("Gas")).toBeInTheDocument();
      expect(screen.getByText("Agua")).toBeInTheDocument();
    });
  
    it("NO muestra botones en modo pozos", () => {
      render(<MapView {...defaultProps} mode="pozos" />);
  
      expect(screen.queryByText("Petróleo")).not.toBeInTheDocument();
    });
  
    it("llama onSelectHeatmapResource al hacer click", () => {
      const mockFn = jest.fn();
  
      render(
        <MapView
          {...defaultProps}
          mode="heatmap"
          onSelectHeatmapResource={mockFn}
        />
      );
  
      fireEvent.click(screen.getByText("Gas"));
  
      expect(mockFn).toHaveBeenCalledWith("gas");
    });
  
    it("selecciona un pozo cuando el mapa dispara el evento", () => {
      render(<MapView {...defaultProps} mode="pozos" />);
  
      fireEvent.click(screen.getByText("Select Well"));
  
      expect(screen.getByText("ProductionPanel")).toBeInTheDocument();
    });
  
    it("muestra error si falla useWells", () => {
      (useWells as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: "Error cargando pozos",
      });
  
      render(<MapView {...defaultProps} mode="pozos" />);
  
      expect(screen.getByText("Error cargando pozos")).toBeInTheDocument();
    });
  
    it("muestra loading cuando está cargando wells", () => {
      (useWells as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });
  
      render(<MapView {...defaultProps} mode="pozos" />);
  
      
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });