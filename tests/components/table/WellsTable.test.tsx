import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WellsTable } from "../../../components/table/WellsTable";

test("renderiza los headers de la tabla", () => {
  render(<WellsTable data={[]} />);

  expect(screen.getByText("ID Pozo")).toBeInTheDocument();
  expect(screen.getByText("Empresa")).toBeInTheDocument();
  expect(screen.getByText("Provincia")).toBeInTheDocument();
});

const mockData = [
  {
    well_id: "123",
    company: "YPF",
    province: "Neuquén",
    watershed: "Neuquina",
    area: "Area 1",
    field: "Campo X",
    status: "Activo",
    resource_type: "Oil",
    type: "Vertical",
    depth: 3000,
    formation: "Vaca Muerta",
    classification: "A",
  },
];

test("renderiza filas con datos", () => {
  render(<WellsTable data={mockData} />);

  expect(screen.getByText("123")).toBeInTheDocument();
  expect(screen.getByText("YPF")).toBeInTheDocument();
  expect(screen.getByText("Neuquén")).toBeInTheDocument();
});

test("no rompe si no hay datos", () => {
  render(<WellsTable data={[]} />);

  const rows = screen.queryAllByRole("row");
  expect(rows.length).toBeGreaterThan(0); // al menos header
});