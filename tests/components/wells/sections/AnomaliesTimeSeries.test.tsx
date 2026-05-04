import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {AnomaliesTimeSeries} from "@/components/well-analysis/anomalies/AnomaliesTimeSeries";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
  LineChart: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
  Line: () => <div />, XAxis: () => <div />, YAxis: () => <div />,
  CartesianGrid: () => <div />, Tooltip: () => <div />, Legend: () => <div />,
}));

jest.mock("@/hooks/useUnit", () => ({
  useUnit: () => ({unit: "m3", setUnit: jest.fn()}),
}));

jest.mock("@/components/well-analysis/anomalies/data", () => ({
  buildAnomalyChartData: () => [{date: "2024-01", resourceProduction: 10, anomalyMarker: null}],
}));

const production = [{
  data_date: "2024-01-01",
  oil_production: 10,
  gas_production: 5,
  water_production: 2,
  water_injection: 0,
  gas_injection: 0,
  co2_injection: 0,
}] as any;

test("renderiza controles de unidades", () => {
  render(<AnomaliesTimeSeries production={production} anomalyPeriods={[]} resource="oil" />);
  expect(screen.getByText("m³")).toBeInTheDocument();
  expect(screen.getByText("BBL")).toBeInTheDocument();
});

test("renderiza sin romper con producción nula", () => {
  render(<AnomaliesTimeSeries production={null} anomalyPeriods={[]} resource="gas" />);
  expect(screen.getByText("m³")).toBeInTheDocument();
});
