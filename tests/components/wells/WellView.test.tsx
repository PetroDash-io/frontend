import { WellView} from "../../../components/wells/WellView";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/hooks/useWells", () => ({
    useWells: jest.fn(),
}));

jest.mock("@/components/map/MapView", () => ({
    MapView: (props: any) => <div data-testid="map-view">{JSON.stringify(props)}</div>,
}));

jest.mock("@/components/table/TableView", () => ({
    TableView: (props: any) => <div data-testid="table-view">{JSON.stringify(props)}</div>,
}));
  
jest.mock("@/components/common/SelectFilter", () => ({
    SelectFilter: () => <div data-testid="select-filter" />,
    SELECT_DEFAULT_VALUE: "ALL",
}));
  
jest.mock("@/components/map/LimitFilter", () => ({
    LimitFilter: () => <div data-testid="limit-filter" />,
}));

test("renderiza vista mapa por default", () => {
    const { useWells } = require("@/hooks/useWells");
    useWells.mockReturnValue({ data: [] });
  
    render(<WellView />);
  
    expect(screen.getByTestId("map-view")).toBeInTheDocument();
    expect(screen.queryByTestId("table-view")).not.toBeInTheDocument();
  });

test("cambia a vista tabla al hacer click", () => {
    const { useWells } = require("@/hooks/useWells");
    useWells.mockReturnValue({ data: [] });
  
    render(<WellView />);
  
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
  
    render(<WellView />);
  
    // no vemos los selects reales, pero verificamos que no crashea
    expect(screen.getAllByTestId("select-filter").length).toBeGreaterThan(0);
  });