"use client"
import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type ItemDeReservorio = Record<string, unknown>;
const MAX_POZOS = 32817;
const colors = {
  bg: "#F3EEE6",
  panel: "#2F3E34",
  panelBorder: "#3F6B4F",
  text: "#1F2937",
  textLight: "#F3EEE6",
  accent: "#D6A23A",
  primary: "#4B2A1A",
  secondary: "#3F6B4F",
};

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
    <>
    <header
      style={{
          height: 64,                 // ⬅️ alto fijo del banner
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 28px",          // padding SOLO horizontal
          background: "linear-gradient(90deg, #3F6B4F, #4B2A1A)",
      }}
    >
      <img
        src="/logo-no-background.png"
        alt="PetroDash"
        style={{
          height: "100%",
          transform: "scale(1.3)",    
          transformOrigin: "left center",
        }}
      />

      <h1
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "#F3EEE6",
          letterSpacing: "0.5px",
        }}
      >
        PetroDash
      </h1>
    </header>
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 24,
        padding: 24,
        maxWidth: 1400,
        margin: "0 auto",
        backgroundColor: colors.bg,
      }}
    >
      <div style={{ gridColumn: "1 / -1" }}>
        <label style={{ fontSize: 14, color: colors.text }}>
          Cantidad de pozos:&nbsp;
          <input
            type="number"
            min={1}
            max={MAX_POZOS}
            value={limit}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= MAX_POZOS) setLimit(value);
            }}
            style={{
              width: 120,
              padding: "6px 8px",
              borderRadius: 8,
              border: `1px solid ${colors.secondary}`,
              backgroundColor: "#fff",
              color: colors.text,
              outlineColor: colors.accent,
            }}
          />
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: colors.primary,
            }}
          >
            máx. {MAX_POZOS.toLocaleString()}
          </span>
        </label>
      </div>
      <h2
        style={{
          gridColumn: "1 / -1",
          marginTop: 16,
          marginBottom: 8,
          fontSize: 20,
          color: colors.primary,
          letterSpacing: "0.4px",
        }}
      >
        Map
      </h2>
      <div>
        <Map
          initialViewState={{
            longitude: -68.059167,
            latitude: -38.951944,
            zoom: 6,
          }}
          style={{ width: "100%", height: 560, borderRadius: 14 }}
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
                    setActivePozo({ id: item.idpozo, lon, lat })
                  }
                  onMouseLeave={() => setActivePozo(null)}
                  onClick={() => setSelectedPozoId(item.idpozo)}
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor:
                      selectedPozoId === item.idpozo
                        ? colors.accent
                        : colors.primary,
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
            >
              <div
                style={{
                  backgroundColor: colors.panel,
                  color: colors.textLight,
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 13,
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <b>Pozo:</b> {activePozo.id}
              </div>
            </Popup>
          )}
        </Map>
      </div>
      <div
        style={{
          border: `1px solid ${colors.panelBorder}`,
          borderRadius: 14,
          padding: 18,
          minHeight: 560,
          backgroundColor: colors.panel,
          color: colors.textLight,
        }}
      >
        {!selectedPozoId && (
          <p style={{ color: colors.textLight, opacity: 0.8 }}>
            Seleccioná un pozo en el mapa
          </p>
        )}

        {loadingPozo && <p>Cargando información...</p>}

        {pozoDetail && !loadingPozo && (
          <>
            <h3 style={{ marginBottom: 16, color: colors.accent }}>
              Pozo {pozoDetail.idpozo}
            </h3>

            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr",
                rowGap: 10,
                columnGap: 12,
                fontSize: 14,
              }}
            >
              {[
                ["Cuenca", pozoDetail.cuenca],
                ["Provincia", pozoDetail.provincia],
                ["Área", pozoDetail.area],
                ["Empresa", pozoDetail.empresa],
                ["Yacimiento", pozoDetail.yacimiento],
                ["Formación", pozoDetail.formacion],
                ["Clasificación", pozoDetail.clasificacion],
                ["Tipo recurso", pozoDetail.tipo_recurso],
                ["Tipo pozo", pozoDetail.tipopozo],
                ["Estado", pozoDetail.tipoestado],
                ["Profundidad", `${pozoDetail.profundidad} metros`],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt style={{ color: colors.accent, fontWeight: 500 }}>
                    {label}
                  </dt>
                  <dd style={{ color: colors.textLight }}>
                    {value}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </>
        )}
      </div>
    </main>
  </>
  );
}
