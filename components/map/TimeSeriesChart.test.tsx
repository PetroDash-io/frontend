import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {TimeSeriesChart} from "./TimeSeriesChart";

const mockData = [
  {
    date: "2024-01",
    oil: 10,
    gas: 5,
    water: 2,
    water_injection: 0,
    gas_injection: 0,
    co2_injection: 0,
  },
  {
    date: "2024-02",
    oil: 12,
    gas: 4,
    water: 2.1,
    water_injection: 1.0,
    gas_injection: 0.5,
    co2_injection: 0.0,
  },
  {
    date: "2024-03",
    oil: 13,
    gas: 7,
    water: 2.5,
    water_injection: 0.8,
    gas_injection: 0.5,
    co2_injection: 0.02,
  },
];

test("muestra los puntos de inyección con cambio no cero", () => {
  render(<TimeSeriesChart data={mockData} />);

  expect(screen.getByText(/Inyección Agua/i)).toBeInTheDocument();
  expect(screen.getByText(/Inyección Gas/i)).toBeInTheDocument();
  expect(screen.getByText(/Inyección CO2/i)).toBeInTheDocument();
});
