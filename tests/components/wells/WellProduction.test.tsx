import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {WellProductionComparisonView} from "@/components/wells/WellProductionComparisonView";
import {useWellsProduction} from "@/hooks/useWellProduction";

jest.mock("@/hooks/useWellProduction", () => ({
  useWellsProduction: jest.fn(),
}));

jest.mock("@/components/wells/sections/WellProductionSection", () => ({
  WellProductionSection: () => <div>WellProductionSection</div>,
}));

jest.mock("@/components/wells/sections/WellAnomaliesSection", () => ({
  WellAnomaliesSection: () => <div>WellAnomaliesSection</div>,
}));

jest.mock("@/components/wells/sections/WellInjectionSection", () => ({
  WellInjectionSection: () => <div>WellInjectionSection</div>,
}));

jest.mock("@/components/wells/sections/WellComparisonSection", () => ({
  WellComparisonSection: () => <div>WellComparisonSection</div>,
}));

describe("WellProductionComparisonView", () => {
  beforeEach(() => {
    (useWellsProduction as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });
  });

  test("muestra mensaje inicial sin pozo", () => {
    render(<WellProductionComparisonView />);
    expect(screen.getByText(/Ingrese un ID de pozo/i)).toBeInTheDocument();
  });

  test("permite ingresar ID de pozo", () => {
    render(<WellProductionComparisonView />);

    const input = screen.getByPlaceholderText(/Ingrese ID del pozo/i);
    fireEvent.change(input, {target: {value: "123"}});

    expect(input).toHaveValue(123);
  });

  test("muestra error con ID inválido", () => {
    render(<WellProductionComparisonView />);

    const input = screen.getByPlaceholderText(/Ingrese ID del pozo/i);
    fireEvent.change(input, {target: {value: "-5"}});
    fireEvent.click(screen.getByText("Buscar"));

    expect(screen.getByText("Ingresá un ID de pozo válido.")).toBeInTheDocument();
  });

  test("muestra flujo de secciones al buscar con ID válido", () => {
    render(<WellProductionComparisonView />);

    const input = screen.getByPlaceholderText(/Ingrese ID del pozo/i);
    fireEvent.change(input, {target: {value: "123"}});
    fireEvent.click(screen.getByText("Buscar"));

    expect(screen.getByText("WellProductionSection")).toBeInTheDocument();
    expect(screen.getByText("Anomalías")).toBeInTheDocument();
    expect(screen.getByText("Curva de inyección")).toBeInTheDocument();
    expect(screen.getByText("Comparación")).toBeInTheDocument();
  });

  test("expande sección de comparación al togglear", () => {
    render(<WellProductionComparisonView />);

    const input = screen.getByPlaceholderText(/Ingrese ID del pozo/i);
    fireEvent.change(input, {target: {value: "123"}});
    fireEvent.click(screen.getByText("Buscar"));

    expect(screen.queryByText("WellComparisonSection")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Comparación").closest("div")!.querySelector("button")!);
    expect(screen.getByText("WellComparisonSection")).toBeInTheDocument();
  });
});
