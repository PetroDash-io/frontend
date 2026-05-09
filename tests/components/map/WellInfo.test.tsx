import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {WellInfo} from "@/components/wells/common/WellInfo";

describe("WellInfo", () => {
  it("muestra estado vacío cuando no hay pozo seleccionado", () => {
    render(<WellInfo wellInfo={null} loadingWell={false} />);

    expect(screen.getByText("Ningún pozo seleccionado")).toBeInTheDocument();
    expect(
      screen.getByText("Seleccioná un pozo en el mapa para ver su información y estado operativo.")
    ).toBeInTheDocument();
  });

  it("muestra loading mientras carga información", () => {
    render(<WellInfo wellInfo={null} loadingWell />);

    expect(screen.getByText("Cargando información...")).toBeInTheDocument();
  });

  it("renderiza detalle y acción cuando hay pozo seleccionado", () => {
    const onDeselectWell = jest.fn();
    render(
      <WellInfo
        loadingWell={false}
        onDeselectWell={onDeselectWell}
        wellInfo={{
          well_id: 39228,
          watershed: "cuyana",
          province: "Mendoza",
          area: "ATAMISQUI",
          company: "Petroleos Sudamericanos S.A.",
          field: "ATAMISQUI",
          formation: "rio blanco",
          classification: "No informado",
          resource_type: null,
          well_type: "Petrolifero",
          extraction_type: "Bombeo Mecanico",
          status: "Extracción Efectiva",
          depth: 2272,
        }}
      />
    );

    expect(screen.getByText("Pozo 39228")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Deseleccionar"));
    expect(onDeselectWell).toHaveBeenCalled();
    expect(screen.getByText("Ver análisis")).toBeInTheDocument();
    expect(screen.getByText("Ubicación")).toBeInTheDocument();
    expect(screen.getByText("Operación")).toBeInTheDocument();
    expect(screen.getAllByText("No informado").length).toBeGreaterThan(0);
  });
});
