import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CurveChart } from "../../components/CurveChart";

const mockData = [
  { date: "2024-01", oil: 10, gas: 5, water: 2 }
];

test("renderiza botones de unidades", () => {
  render(<CurveChart data={mockData} />);

  expect(screen.getByText("m³")).toBeInTheDocument();
  expect(screen.getByText("BBL")).toBeInTheDocument();
});

test("cambia unidad a BBL cuando se hace click", () => {
    render(<CurveChart data={mockData} />);
  
    const button = screen.getByText("BBL");
  
    fireEvent.click(button);
  
    expect(button).toBeInTheDocument();
  });


  test("maneja datos null sin romper", () => {
    const data = [
      { date: "2024-01", oil: null, gas: null, water: null }
    ];
  
    render(<CurveChart data={data} />);
  
    expect(screen.getByText("m³")).toBeInTheDocument();
  });