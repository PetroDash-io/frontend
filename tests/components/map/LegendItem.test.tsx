import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LegendItem } from "@/components/wells/map/LegendItem";

describe("LegendItem", () => {
  it("renderiza el label con color (modo dot)", () => {
    render(<LegendItem color="#00ff00" label="Activo" />);

    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("renderiza el label con shape circle", () => {
    render(<LegendItem shape="circle" label="Convencional" />);

    expect(screen.getByText("Convencional")).toBeInTheDocument();
  });

  it("renderiza el label con shape triangle", () => {
    render(<LegendItem shape="triangle" label="No convencional" />);

    expect(screen.getByText("No convencional")).toBeInTheDocument();
  });
});
