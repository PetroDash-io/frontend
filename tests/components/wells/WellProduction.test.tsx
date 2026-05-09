import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {WellAnalysisView} from "@/components/well-analysis/WellAnalysisView";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {useWell} from "@/hooks/useWell";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

jest.mock("@/hooks/useWellProduction", () => ({
  useWellsProduction: jest.fn(),
}));

jest.mock("@/hooks/useWell", () => ({
  useWell: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/components/well-analysis/production/WellProductionSection", () => ({
  WellProductionSection: () => <div>WellProductionSection</div>,
}));

jest.mock("@/components/well-analysis/anomalies/WellAnomaliesSection", () => ({
  WellAnomaliesSection: () => <div>WellAnomaliesSection</div>,
}));

jest.mock("@/components/well-analysis/injection/WellInjectionSection", () => ({
  WellInjectionSection: () => <div>WellInjectionSection</div>,
}));

jest.mock("@/components/well-analysis/comparison/WellComparisonSection", () => ({
  WellComparisonSection: () => <div>WellComparisonSection</div>,
}));

describe("WellProductionComparisonView", () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    replaceMock.mockClear();
    (useRouter as jest.Mock).mockReturnValue({replace: replaceMock});
    (usePathname as jest.Mock).mockReturnValue("/analisis-pozo");
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
      toString: () => "",
    });

    (useWellsProduction as jest.Mock).mockReturnValue({
      data: [],
      eur: null,
      loading: false,
      error: null,
    });

    (useWell as jest.Mock).mockReturnValue({
      data: {
        well_id: 123,
        watershed: "NEUQUINA",
        province: "Neuquen",
        area: "Loma",
        company: "YPF",
        field: "Campo",
        formation: "Formacion",
        classification: "No informado",
        resource_type: "oil",
        well_type: "Productor",
        extraction_type: "Bombeo",
        status: "Activo",
        depth: 1000,
        first_production_activity_date: "2021-03-01",
      },
      loading: false,
      error: null,
    });
  });

  test("muestra mensaje inicial sin pozo", () => {
    render(<WellAnalysisView />);
    expect(screen.getByText(/Ingrese un ID de pozo/i)).toBeInTheDocument();
  });

  test("permite ingresar ID de pozo", () => {
    render(<WellAnalysisView />);

    const input = screen.getByPlaceholderText(/Ingrese ID/i);
    fireEvent.change(input, {target: {value: "123"}});

    expect(input).toHaveValue(123);
  });

  test("muestra error con ID inválido", () => {
    render(<WellAnalysisView />);

    const input = screen.getByPlaceholderText(/Ingrese ID/i);
    fireEvent.change(input, {target: {value: "-5"}});
    fireEvent.click(screen.getByText("Ver producción"));

    expect(screen.getByText("Ingresá un ID de pozo válido.")).toBeInTheDocument();
  });

  test("muestra flujo de secciones al buscar con ID válido", () => {
    render(<WellAnalysisView />);

    const input = screen.getByPlaceholderText(/Ingrese ID/i);
    fireEvent.change(input, {target: {value: "123"}});
    fireEvent.click(screen.getByText("Ver producción"));

    expect(screen.getByText("WellProductionSection")).toBeInTheDocument();
    expect(screen.getByText("Anomalías")).toBeInTheDocument();
    expect(screen.getByText("Curva de inyección")).toBeInTheDocument();
    expect(screen.getByText("Comparación")).toBeInTheDocument();
    expect(screen.getByText("Resumen del pozo")).toBeInTheDocument();
    expect(screen.getByText("03/2021")).toBeInTheDocument();
  });

  test("muestra fallback cuando no hay historial de producción", () => {
    (useWell as jest.Mock).mockReturnValue({
      data: {
        well_id: 123,
        watershed: "NEUQUINA",
        province: "Neuquen",
        area: "Loma",
        company: "YPF",
        field: "Campo",
        formation: "Formacion",
        classification: "No informado",
        resource_type: "oil",
        well_type: "Productor",
        extraction_type: "Bombeo",
        status: "Activo",
        depth: 1000,
        first_production_activity_date: null,
      },
      loading: false,
      error: null,
    });

    render(<WellAnalysisView />);

    const input = screen.getByPlaceholderText(/Ingrese ID/i);
    fireEvent.change(input, {target: {value: "123"}});
    fireEvent.click(screen.getByText("Ver producción"));

    expect(screen.getByText("No hay producción registrada")).toBeInTheDocument();
  });

  test("expande sección de comparación al togglear", () => {
    render(<WellAnalysisView />);

    const input = screen.getByPlaceholderText(/Ingrese ID/i);
    fireEvent.change(input, {target: {value: "123"}});
    fireEvent.click(screen.getByText("Ver producción"));

    expect(screen.queryByText("WellComparisonSection")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Comparación").closest("div")!.querySelector("button")!);
    expect(screen.getByText("WellComparisonSection")).toBeInTheDocument();
  });

  test("actualiza la URL al buscar con ID válido", () => {
    render(<WellAnalysisView />);

    const input = screen.getByPlaceholderText(/Ingrese ID/i);
    fireEvent.change(input, {target: {value: "123"}});
    fireEvent.click(screen.getByText("Ver producción"));

    expect(replaceMock).toHaveBeenCalledWith("/analisis-pozo?wellId=123");
  });

  test("auto-aplica wellId desde query param", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === "wellId" ? "456" : null),
    });

    render(<WellAnalysisView />);

    expect(screen.getByDisplayValue("456")).toBeInTheDocument();
    expect(screen.getByText("WellProductionSection")).toBeInTheDocument();
  });
});
