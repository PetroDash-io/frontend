import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CompanyView } from "../../../components/company/CompanyView";

// hooks
import { useCompanies } from "@/hooks/useCompanies";
import { useProductionAggregates } from "@/hooks/useProductionAggregates";
import { useCompanyComparison } from "@/hooks/useCompanyComparison";
import { useUnit } from "@/hooks/useUnit";

// mocks hooks
jest.mock("@/hooks/useCompanies", () => ({
  useCompanies: jest.fn(),
}));

jest.mock("@/hooks/useProductionAggregates", () => ({
  useProductionAggregates: jest.fn(),
}));

jest.mock("@/hooks/useCompanyComparison", () => ({
  useCompanyComparison: jest.fn(),
}));

jest.mock("@/hooks/useUnit", () => ({
  useUnit: jest.fn(),
}));

// mock toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// mock hijos
jest.mock("@/components/company/ProductionBarChart", () => ({
  ProductionBarChart: () => <div>ProductionBarChart</div>,
}));

jest.mock("@/components/company/CompanyComparisonPanel", () => ({
  CompanyComparisonPanel: () => <div>ComparisonPanel</div>,
}));

jest.mock("@/components/company/CompanyComparisonCharts", () => ({
  CompanyComparisonCharts: () => <div>ComparisonCharts</div>,
}));

jest.mock("@/components/common/CompaniesBarChart", () => ({
  CompaniesBarChart: () => <div>CompaniesBarChart</div>,
}));

jest.mock("@/components/common/UnitTabs", () => ({
  UnitTabs: () => <div>UnitTabs</div>,
}));

jest.mock("@/components/common/SelectFilter", () => ({
  SelectFilter: () => <div>SelectFilter</div>,
}));

// defaults
beforeEach(() => {
  (useCompanies as jest.Mock).mockReturnValue({
    companies: [
      { empresa: "YPF", cantidad_pozos: 10 },
      { empresa: "Shell", cantidad_pozos: 5 },
    ],
    loading: false,
    error: null,
  });

  (useProductionAggregates as jest.Mock).mockReturnValue({
    data: null,
    loading: false,
    error: null,
  });

  (useCompanyComparison as jest.Mock).mockReturnValue({
    data: null,
    loading: false,
    error: null,
  });

  (useUnit as jest.Mock).mockReturnValue({
    unit: "bbl",
    setUnit: jest.fn(),
  });
});

describe("CompanyView", () => {
  it("renderiza el título", () => {
    render(<CompanyView />);

    expect(
      screen.getByText("Análisis de Empresas y Producción")
    ).toBeInTheDocument();
  });

  it("muestra loading cuando production está cargando", () => {
    (useProductionAggregates as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<CompanyView />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay data", () => {
    render(<CompanyView />);

    expect(
      screen.getByText(
        /Seleccione una empresa y un rango de fechas/i
      )
    ).toBeInTheDocument();
  });

  it("muestra error si falla un hook", () => {
    (useCompanies as jest.Mock).mockReturnValue({
      companies: [],
      loading: false,
      error: "Error empresas",
    });

    render(<CompanyView />);

    expect(screen.getByText("Error empresas")).toBeInTheDocument();
  });

  it("muestra charts cuando hay data", () => {
    (useProductionAggregates as jest.Mock).mockReturnValue({
      data: {
        oil: { total: 100, avg: 10 },
        water: { total: 200, avg: 20 },
        gas: { total: 300, avg: 30 },
      },
      loading: false,
      error: null,
    });

    render(<CompanyView />);

    expect(screen.getAllByText("ProductionBarChart").length).toBeGreaterThan(0);
  });

  it("cambia valor del slider", () => {
    render(<CompanyView />);

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "10" } });

    expect(slider).toHaveValue("10");
  });

});