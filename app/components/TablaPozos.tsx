import type { PozoDetail } from "../types";
import { colors } from "../utils/constants";


interface TablaPozosProps {
  data: PozoDetail[];
  onSelectedPozo?: (id: string) => void;
}

export function TablaPozos({ data, onSelectedPozo }: TablaPozosProps) {
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
                key={pozo.idpozo}
                onClick={() => onSelectedPozo?.(pozo.idpozo)}
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
                <td style={cell}>{pozo.idpozo}</td>
                <td style={cell}>{pozo.empresa}</td>
                <td style={cell}>{pozo.provincia}</td>
                <td style={cell}>{pozo.cuenca}</td>
                <td style={cell}>{pozo.area}</td>
                <td style={cell}>{pozo.yacimiento}</td>
                <td style={cell}>{pozo.tipoestado}</td>
                <td style={cell}>{pozo.tipo_recurso}</td>
                <td style={cell}>{pozo.tipopozo}</td>
                <td style={cell}>{pozo.profundidad}</td>
                <td style={cell}>{pozo.formacion}</td>
                <td style={cell}>{pozo.clasificacion}</td>
                
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