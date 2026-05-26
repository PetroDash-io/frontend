import { classifyWell } from "@/utils/wellClassification";
import type { WellDetail } from "@/app/types";

const well = (resource_type: string | null): WellDetail =>
  ({ resource_type } as unknown as WellDetail);

describe("classifyWell", () => {
  it('retorna "no_conv" para NO CONVENCIONAL', () => {
    expect(classifyWell(well("NO CONVENCIONAL"))).toBe("no_conv");
  });

  it('retorna "no_conv" ignorando mayusculas/minusculas y espacios', () => {
    expect(classifyWell(well("  no convencional  "))).toBe("no_conv");
  });

  it('retorna "unknown" para No informado', () => {
    expect(classifyWell(well("No informado"))).toBe("unknown");
  });

  it('retorna "unknown" para SIN RESERVORIO', () => {
    expect(classifyWell(well("SIN RESERVORIO"))).toBe("unknown");
  });

  it('retorna "unknown" para null', () => {
    expect(classifyWell(well(null))).toBe("unknown");
  });

  it('retorna "conv" para CONVENCIONAL', () => {
    expect(classifyWell(well("CONVENCIONAL"))).toBe("conv");
  });

  it('retorna "conv" para cualquier otro valor no nulo', () => {
    expect(classifyWell(well("OTRO_TIPO"))).toBe("conv");
  });
});
