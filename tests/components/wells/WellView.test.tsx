import { WellsView} from "@/components/wells/WellsView";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/hooks/useWells", () => ({
    useWells: jest.fn(),
}));

jest.mock("@/components/wells/MapView", () => ({
    MapView: (props: any) => <div data-testid="map-view">{JSON.stringify(props)}</div>,
}));

jest.mock("@/components/wells/TableView", () => ({
    TableView: (props: any) => <div data-testid="table-view">{JSON.stringify(props)}</div>,
}));
  
jest.mock("@/components/common/SelectFilter", () => ({
    SelectFilter: () => <div data-testid="select-filter" />,
    SELECT_DEFAULT_VALUE: "ALL",
}));
  
jest.mock("@/components/wells/common/LimitFilter", () => ({
    LimitFilter: () => <div data-testid="limit-filter" />,
}));

jest.mock("@/components/wells/common/ClassificationFilter", () => ({
    ClassificationFilter: () => <div data-testid="classification-filter" />,
}));

test("renderiza vista mapa por default", () => {
    const { useWells } = require("@/hooks/useWells");
    useWells.mockReturnValue({ data: [] });
  
    render(<WellsView />);
  
    expect(screen.getByTestId("map-view")).toBeInTheDocument();
    expect(screen.queryByTestId("table-view")).not.toBeInTheDocument();
  });

test("cambia a vista tabla al hacer click", () => {
    const { useWells } = require("@/hooks/useWells");
    useWells.mockReturnValue({ data: [] });
  
    render(<WellsView />);
  
    fireEvent.click(screen.getByText("Tabla"));
  
    expect(screen.getByTestId("table-view")).toBeInTheDocument();
  });

test("genera opciones de filtros desde los datos", () => {
    const { useWells } = require("@/hooks/useWells");
  
    useWells.mockReturnValue({
      data: [
        { province: "Neuquen", status: "Activo", company: "YPF" },
        { province: "Mendoza", status: "Inactivo", company: "Shell" },
      ],
    });
  
    render(<WellsView />);
  
    // no vemos los selects reales, pero verificamos que no crashea
    expect(screen.getAllByTestId("select-filter").length).toBeGreaterThan(0);
  });

test("renderiza el filtro de clasificación", () => {
    const { useWells } = require("@/hooks/useWells");
    useWells.mockReturnValue({ data: [] });

    render(<WellsView />);

    expect(screen.getByTestId("classification-filter")).toBeInTheDocument();
});

test("mantiene solo control primario de vista", () => {
    const { useWells } = require("@/hooks/useWells");
    useWells.mockReturnValue({ data: [] });

    render(<WellsView />);

    expect(screen.getByText("Mapa")).toBeInTheDocument();
    expect(screen.getByText("Tabla")).toBeInTheDocument();
    expect(screen.queryByText("Pozos")).not.toBeInTheDocument();
    expect(screen.queryByText("Heatmap")).not.toBeInTheDocument();
  });
