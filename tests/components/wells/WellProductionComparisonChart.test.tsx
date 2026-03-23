// WellProductionComparisonChart.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WellProductionComparisonChart} from "../../../components/wells/WellProductionComparisonChart";

import { useWellProductionComparison } from "@/hooks/useWellProductionComparison";

jest.mock("@/hooks/useWellProductionComparison");
const mockHook = (value: any) => {
    (useWellProductionComparison as jest.Mock).mockReturnValue(value);
  };
  
test("muestra mensaje inicial sin pozo", () => {
    mockHook({ data: null, loading: false, error: null });
  
    render(<WellProductionComparisonChart />);
  
    expect(screen.getByText(/Ingrese un ID de pozo/i)).toBeInTheDocument();
  });


test("permite ingresar ID de pozo", () => {
    mockHook({ data: null, loading: false, error: null });
  
    render(<WellProductionComparisonChart />);
  
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
  
    render(<WellProductionComparisonChart />);
  
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
  
    render(<WellProductionComparisonChart />);
  
    expect(screen.getByText(/Descargar Excel/i)).toBeInTheDocument();
  });