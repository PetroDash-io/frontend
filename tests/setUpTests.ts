import "@testing-library/jest-dom";

jest.mock("recharts", () => {
    const React = require("react");
  
    return {
      __esModule: true,
  
      ResponsiveContainer: ({ children }: any) =>
        React.createElement("div", null, children),
  
      LineChart: ({ children }: any) =>
        React.createElement("div", null, children),
  
      Line: ({ children }: any) =>
        React.createElement("div", null, children),
  
      XAxis: () => React.createElement("div"),
      YAxis: () => React.createElement("div"),
      CartesianGrid: () => React.createElement("div"),
      Tooltip: () => React.createElement("div"),
      Legend: () => React.createElement("div"),
  
      // (opcional: dejás también los de BarChart por si los usás en otros tests)
      BarChart: ({ children }: any) =>
        React.createElement("div", null, children),
      Bar: ({ children }: any) =>
        React.createElement("div", null, children),
      Cell: () => React.createElement("div"),
    };
  });