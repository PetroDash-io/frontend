import type { PozoDetail } from "@/app/types";
import { colors } from "@/utils/constants";


interface WellsTableProps {
  data: PozoDetail[];
  onSelectedPozo?: (id: string) => void;
}

export function WellsTable({ data, onSelectedPozo }: WellsTableProps) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          border: `1px solid ${colors.panelBorder}`,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              {[
                "ID Pozo",
                "Empresa",
                "Provincia",
                "Cuenca",
                "Área",
                "Yacimiento",
                "Estado",
                "Tipo de Recurso",
                "Tipo de pozo",
                "Profundidad",
                "Formación",
                "Clasificación",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 8px",
                    borderBottom: `2px solid ${colors.panelBorder}`,
                    color: colors.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {data.map((pozo) => (
              <tr
                key={pozo.well_id}
                onClick={() => onSelectedPozo?.(pozo.well_id)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f6f6f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={cell}>{pozo.well_id}</td>
                <td style={cell}>{pozo.company}</td>
                <td style={cell}>{pozo.province}</td>
                <td style={cell}>{pozo.watershed}</td>
                <td style={cell}>{pozo.area}</td>
                <td style={cell}>{pozo.field}</td>
                <td style={cell}>{pozo.status}</td>
                <td style={cell}>{pozo.resource_type}</td>
                <td style={cell}>{pozo.type}</td>
                <td style={cell}>{pozo.depth}</td>
                <td style={cell}>{pozo.formation}</td>
                <td style={cell}>{pozo.classification}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  const cell: React.CSSProperties = {
    padding: "8px",
    whiteSpace: "nowrap",
    color: "#222",
  };