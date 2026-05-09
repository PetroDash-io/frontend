import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {WellMetrics} from "@/components/wells/common/WellMetrics";

describe("WellMetrics", () => {
  const filters = {
    watershed: "Noroeste",
    province: "",
    status: "",
    company: "",
    limit: 100,
  };

  it("muestra tarjetas de métricas", () => {
    render(
      <WellMetrics
        items={[
          {label: "Pozos activos", value: "1.2K"},
          {label: "Pozos inactivos", value: "811"},
          {label: "Pozos parados", value: "23"},
          {label: "No informados", value: "0"},
          {label: "Producción total del último mes (Petróleo)", value: "8.2K", subLabel: "Mes registrado: 2025-12"},
        ]}
        filters={filters}
        filteredCount={100}
      />
    );

    expect(screen.getByText("Resumen de pozos filtrados")).toBeInTheDocument();
    expect(screen.getByText("Cuenca Noroeste · Provincia Todas · Estado Todos · Empresa Todas · Límite 100")).toBeInTheDocument();
    expect(screen.getByText("100 pozos en mapa")).toBeInTheDocument();
    expect(screen.getByText("Pozos activos")).toBeInTheDocument();
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("muestra estado de loading", () => {
    render(<WellMetrics items={[]} loading filters={filters} filteredCount={0} />);

    expect(screen.getByText("Cargando métricas...")).toBeInTheDocument();
  });

  it("muestra estado de error", () => {
    render(<WellMetrics items={[]} error="Error" filters={filters} filteredCount={0} />);

    expect(screen.getByText("No se pudieron cargar las métricas.")).toBeInTheDocument();
  });

  it("muestra estado vacío sin datos", () => {
    render(<WellMetrics items={[]} filters={filters} filteredCount={0} />);

    expect(screen.getByText("Sin datos disponibles.")).toBeInTheDocument();
  });
});
