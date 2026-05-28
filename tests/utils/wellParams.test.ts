import { buildWellFilterParams } from "@/utils/wellParams";
import type { WellFilters } from "@/app/types/wellFilters";

const base: WellFilters = {
  watershed: "NEUQUINA",
  company: "",
  province: "",
  status: "",
  limit: 100,
  classification: "all",
};

describe("buildWellFilterParams", () => {
  it("siempre agrega watershed", () => {
    const params = buildWellFilterParams(base);
    expect(params.get("watershed")).toBe("NEUQUINA");
  });

  it("omite campos opcionales vacios", () => {
    const params = buildWellFilterParams(base);
    expect(params.has("company")).toBe(false);
    expect(params.has("province")).toBe(false);
    expect(params.has("status")).toBe(false);
    expect(params.has("resource_type")).toBe(false);
  });

  it("agrega campos opcionales cuando tienen valor", () => {
    const params = buildWellFilterParams({
      ...base,
      company: "YPF",
      province: "Neuquén",
      status: "Activo",
    });
    expect(params.get("company")).toBe("YPF");
    expect(params.get("province")).toBe("Neuquén");
    expect(params.get("status")).toBe("Activo");
  });

  it("agrega resource_type=CONVENCIONAL cuando classification es conv", () => {
    const params = buildWellFilterParams({ ...base, classification: "conv" });
    expect(params.get("resource_type")).toBe("CONVENCIONAL");
  });

  it("agrega resource_type=NO CONVENCIONAL cuando classification es no_conv", () => {
    const params = buildWellFilterParams({ ...base, classification: "no_conv" });
    expect(params.get("resource_type")).toBe("NO CONVENCIONAL");
  });

  it("no agrega resource_type cuando classification es all", () => {
    const params = buildWellFilterParams({ ...base, classification: "all" });
    expect(params.has("resource_type")).toBe(false);
  });
});
