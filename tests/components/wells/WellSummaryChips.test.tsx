import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WellSummaryChips } from "@/components/well-analysis/WellSummaryChips";
import { WellDetail } from "@/app/types";

const mockWell: WellDetail = {
  well_id: 3640,
  watershed: "neuquina",
  province: "Neuquén",
  area: "ENTRE LOMAS",
  company: "Petrolera Aconcagua Energia S.A.",
  field: "EL CARACOL",
  formation: "vaca muerta",
  classification: "EXPLOTACION",
  resource_type: "NO CONVENCIONAL",
  well_type: "Petrolífero",
  extraction_type: "Bombeo Mecánico",
  status: "Extracción Efectiva",
  depth: 2585,
};

describe("WellSummaryChips", () => {
  it("muestra el chip Tipo de recurso con el valor del pozo", () => {
    render(<WellSummaryChips wellDetails={mockWell} loading={false} error={null} />);

    expect(screen.getByText("Tipo de recurso")).toBeInTheDocument();
    expect(screen.getByText("No Convencional")).toBeInTheDocument();
  });

  it("muestra 'No informado' cuando resource_type es null", () => {
    render(
      <WellSummaryChips
        wellDetails={{ ...mockWell, resource_type: null }}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText("Tipo de recurso")).toBeInTheDocument();
    expect(screen.getByText("No informado")).toBeInTheDocument();
  });

  it("muestra estado de carga", () => {
    render(<WellSummaryChips wellDetails={null} loading error={null} />);

    expect(screen.getByText("Cargando información del pozo...")).toBeInTheDocument();
  });

  it("muestra estado de error", () => {
    render(<WellSummaryChips wellDetails={null} loading={false} error="Error al cargar" />);

    expect(screen.getByText("Error al cargar")).toBeInTheDocument();
  });
});
