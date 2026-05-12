// WellProductionComparisonView.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WellProductionComparisonView} from "../../../components/wells/WellProductionComparisonView";

import { useWellProductionComparison } from "@/hooks/useWellProductionComparison";
import { useMonthlyAggregatedProduction } from "@/hooks/useMonthlyAggregatedProduction";

jest.mock("@/hooks/useWellProductionComparison");
jest.mock("@/hooks/useMonthlyAggregatedProduction");

const mockHook = (value: any) => {
    (useWellProductionComparison as jest.Mock).mockReturnValue(value);
    (useMonthlyAggregatedProduction as jest.Mock).mockReturnValue({ data: null, loading: false });
  };
  
test("muestra mensaje inicial sin pozo", () => {
    mockHook({ data: null, loading: false, error: null });
  
    render(<WellProductionComparisonView />);
  
    expect(screen.getByText(/Ingrese un ID de pozo/i)).toBeInTheDocument();
  });


test("permite ingresar ID de pozo", () => {
    mockHook({ data: null, loading: false, error: null });
  
    render(<WellProductionComparisonView />);
  
    const input = screen.getByPlaceholderText(/Ingrese ID del pozo/i);
  
    fireEvent.change(input, { target: { value: "123" } });
  
    expect(input).toHaveValue(123);
  });


  test("muestra info del pozo cuando hay data", () => {
    mockHook({
      loading: false,
      error: null,
      data: {
        well_id: 123,
        company: "YPF",
        area: "Vaca Muerta",
        province: "Neuquén",
        data: [{
          oil: { total: 100, median: 80 },
          gas: { total: 200, median: 150 },
          water: { total: 50, median: 40 },
        }]
      }
    });
  
    render(<WellProductionComparisonView />);
  
    expect(screen.getByText(/YPF/i)).toBeInTheDocument();
    expect(screen.getByText(/Neuquén/i)).toBeInTheDocument();
  });

test("muestra botón de descarga solo con datos", () => {
  mockHook({
    loading: false,
    error: null,
    data: {
      well_id: 1,
      data: [{
        oil: { total: 1, median: 1 },
        gas: { total: 1, median: 1 },
        water: { total: 1, median: 1 },
      }]
    }
  });

  render(<WellProductionComparisonView />);

  expect(screen.getByText(/Descargar Excel/i)).toBeInTheDocument();
});


test("muestra botón de descarga solo con datos", () => {
  mockHook({
    loading: false,
    error: null,
    data: {
      well_id: 1,
      data: [{
        oil: { total: 1, median: 1 },
        gas: { total: 1, median: 1 },
        water: { total: 1, median: 1 },
      }]
    }
  });

  render(<WellProductionComparisonView />);

  expect(screen.getByText(/Descargar Excel/i)).toBeInTheDocument();
});