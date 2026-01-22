"use client"
import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type ItemDeReservorio = Record<string, unknown>;
const MAX_POZOS = 32817;

export default function Home() {
  const [reservorio, setReservorio] = useState<ItemDeReservorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePozo, setActivePozo] = useState<{
  id: string;
  lon: number;
  lat: number;
} | null>(null);
  const [limit, setLimit] = useState(100);
  const [selectedPozoId, setSelectedPozoId] = useState<string | null>(null);
  const [pozoDetail, setPozoDetail] = useState<any>(null);
  const [loadingPozo, setLoadingPozo] = useState(false);


  useEffect(() => {
    const url = `https://petrodashbackend.onrender.com/pozos?limit=${limit}`;
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const json = await response.json();
        console.log("json", json);

        const { data } = json;
        const normalized: ItemDeReservorio[] = Array.isArray(data) ? data : data ? [data] : [];
        setReservorio(normalized);
      } catch (error) {
        console.log("error CORS", error);
        setError(error instanceof Error ? error.message : "Unexpected error");
      }
      setLoading(false);
    };

    fetchData();
  }, [limit]);

  useEffect(() => {
    if (!selectedPozoId) return;

    const fetchPozo = async () => {
      setLoadingPozo(true);
      try {
        const response = await fetch(
          `https://petrodashbackend.onrender.com/pozos/${selectedPozoId}`,
          {
            headers: {
              "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar el pozo");
        }

        const json = await response.json();
        setPozoDetail(json.data[0]);
      } catch (err) {
        console.error(err);
        setPozoDetail(null);
      } finally {
        setLoadingPozo(false);
      }
    };

    fetchPozo();
  }, [selectedPozoId]);

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 24,
        padding: 24,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 14 }}>
            Cantidad de pozos:&nbsp;
            <input
              type="number"
              min={1}
              max={MAX_POZOS}
              value={limit}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= MAX_POZOS) {
                  setLimit(value);
                }
              }}
              style={{
                width: 120,
                padding: 4,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <span style={{ marginLeft: 8, fontSize: 12, color: "#666" }}>
              máx. {MAX_POZOS.toLocaleString()}
            </span>
          </label>
        </div>
        <h2 style={{ marginTop: "32px", marginBottom: "16px", fontSize: "20px" }}>Map</h2>  
        <Map
          initialViewState={{
            longitude: -68.059167,
            latitude: -38.951944,
            zoom: 6,
          }}
          style={{ width: "100%", height: 400, borderRadius: 12 }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
          {reservorio.map((item: any) => {
            if (!item.geojson) return null;

            let lon: number, lat: number;

            try {
              const geo = JSON.parse(item.geojson);
              [lon, lat] = geo.coordinates;
            } catch {
              return null;
            }

            return (
              <Marker
                key={item.idpozo}
                longitude={lon}
                latitude={lat}
                anchor="center"
              >
              <div
                onMouseEnter={() =>
                  setActivePozo({
                    id: item.idpozo,
                    lon,
                    lat,
                  })
                }
                onMouseLeave={() => setActivePozo(null)}
                onClick={() => setSelectedPozoId(item.idpozo)}
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor:
                    selectedPozoId === item.idpozo
                      ? "rgba(59, 130, 246, 1)" // azul seleccionado
                      : "rgba(225, 29, 29, 1)", // rojo normal
                  borderRadius: "50%",
                  opacity: 0.9,
                  cursor: "pointer",
                }}
              />
              </Marker>
            );
          })}
          {activePozo && (
            <Popup
              longitude={activePozo.lon}
              latitude={activePozo.lat}
              closeButton={false}
              closeOnClick={true}
              anchor="top"
              className="pozo-popup-wrapper"
            >
              <div className="pozo-popup">
                <b>Pozo:</b> {activePozo.id}
              </div>
            </Popup>
          )}
        </Map>
      </div>
      <div style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          minHeight: 400,
          color: "#e5e7eb",    
          backgroundColor: "#2b314dff"        
        }}
      >
        {!selectedPozoId && (
          <p style={{ color: "#666" }}>
            Seleccioná un pozo en el mapa
          </p>
        )}

        {loadingPozo && <p>Cargando información...</p>}

        {pozoDetail && !loadingPozo && (
          <>
            <h3 style={{ marginBottom: 12 }}>
              Pozo {pozoDetail.idpozo}
            </h3>

            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                rowGap: 8,
                columnGap: 12,
                fontSize: 14,
              }}
            >
              <dt style={{ color: "#fafafaff" }}><b>Cuenca</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.cuenca}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Provincia</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.provincia}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Área</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.area}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Empresa</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.empresa}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Yacimiento</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.yacimiento}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Formación</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.formacion}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Clasificación</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.clasificacion}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Tipo recurso</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.tipo_recurso}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Tipo pozo</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.tipopozo}</dd>

              <dt style={{ color: "#fafafaff" }}><b>Estado</b></dt>
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.tipoestado}</dd>
              <dt style={{ color: "#fafafaff" }}><b>Profundidad</b></dt>  
              <dd style={{ color: "#fafafaff" }}>{pozoDetail.profundidad} metros</dd>
            </dl>
          </>
        )}



      </div>
    </main>
  );
}
