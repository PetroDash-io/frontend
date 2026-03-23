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