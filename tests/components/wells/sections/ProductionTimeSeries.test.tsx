import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {ProductionTimeSeries} from "@/components/wells/sections/ProductionTimeSeries";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
  LineChart: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
  Line: () => <div />, XAxis: () => <div />, YAxis: () => <div />,
  CartesianGrid: () => <div />, Tooltip: () => <div />, Legend: () => <div />,
}));

jest.mock("@/hooks/useUnit", () => ({
  useUnit: () => ({unit: "m3", setUnit: jest.fn()}),
}));

const mockData = [{date: "2024-01", oil: 10, gas: 5, water: 2}];

test("renderiza controles de unidades", () => {
  render(<ProductionTimeSeries data={mockData} />);
  expect(screen.getByText("m³")).toBeInTheDocument();
  expect(screen.getByText("BBL")).toBeInTheDocument();
});

test("renderiza sin romper con datos vacíos", () => {
  render(<ProductionTimeSeries data={[]} />);
  expect(screen.getByText("m³")).toBeInTheDocument();
});
