import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TableView } from "@/components/table/TableView";
import { useWells } from "@/hooks/useWells";
import { toast } from "react-toastify";

jest.mock("@/hooks/useWells");

jest.mock("@/components/table/WellsTable", () => ({
  WellsTable: ({ data }: any) => <div>TABLE {data.length}</div>,
}));

jest.mock("@/components/common/LoadingState", () => ({
  LoadingState: () => <div>LOADING</div>,
}));

jest.mock("@/components/common/InlineMessage", () => ({
  InlineMessage: ({ message }: any) => <div>ERROR: {message}</div>,
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));


test("renderiza la tabla con datos", () => {
    (useWells as jest.Mock).mockReturnValue({
      data: [{ id: 1 }, { id: 2 }],
      loading: false,
      error: null,
    });
  
    render(<TableView filters={{} as any} />);
  
    expect(screen.getByText("TABLE 2")).toBeInTheDocument();
  });


test("dispara toast cuando hay error", () => {
  (useWells as jest.Mock).mockReturnValue({
    data: null,
    loading: false,
    error: "Error grave",
  });

  render(<TableView filters={{} as any} />);

  expect(toast.error).toHaveBeenCalledWith(
    "Error grave",
    expect.any(Object)
  );
});