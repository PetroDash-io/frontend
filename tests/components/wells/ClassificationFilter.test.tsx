import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ClassificationFilter } from "@/components/wells/common/ClassificationFilter";

describe("ClassificationFilter", () => {
  it("renderiza los tres botones", () => {
    render(<ClassificationFilter value="all" onChange={jest.fn()} />);

    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.getByText("Convencional")).toBeInTheDocument();
    expect(screen.getByText("No convencional")).toBeInTheDocument();
  });

  it("llama onChange con 'conv' al clickear Convencional", () => {
    const onChange = jest.fn();
    render(<ClassificationFilter value="all" onChange={onChange} />);

    fireEvent.click(screen.getByText("Convencional"));

    expect(onChange).toHaveBeenCalledWith("conv");
  });

  it("llama onChange con 'nc' al clickear No convencional", () => {
    const onChange = jest.fn();
    render(<ClassificationFilter value="all" onChange={onChange} />);

    fireEvent.click(screen.getByText("No convencional"));

    expect(onChange).toHaveBeenCalledWith("no_conv");
  });

  it("llama onChange con 'all' al clickear Todos", () => {
    const onChange = jest.fn();
    render(<ClassificationFilter value="conv" onChange={onChange} />);

    fireEvent.click(screen.getByText("Todos"));

    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("no llama onChange si se clickea el botón ya activo", () => {
    const onChange = jest.fn();
    render(<ClassificationFilter value="conv" onChange={onChange} />);

    fireEvent.click(screen.getByText("Convencional"));

    expect(onChange).not.toHaveBeenCalled();
  });
});
