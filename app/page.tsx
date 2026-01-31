"use client";

import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";


import { MAX_POZOS, colors, LEGEND_ITEMS } from "./utils/constants";
import { getPozoColor } from "./utils/helpers";
import { LegendItem } from "./components/LegendItem";
import type { ActivePozo, PozoDetail } from "./types";
import { TablaPozos } from "./components/TablaPozos";

export default function Home() {
  const [reservorio, setReservorio] = useState<PozoDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(
    {
      provincia: "ALL",
      tipoestado: "ALL",
      empresa: "ALL"
    }
  );

  const reservorioFiltrado = reservorio.filter((pozo) => {
    if (filters.provincia !== "ALL" && pozo.provincia !== filters.provincia)
      return false;
  
    if (filters.tipoestado !== "ALL" && pozo.tipoestado !== filters.tipoestado)
      return false;
  
    if (filters.empresa !== "ALL" && pozo.empresa !== filters.empresa)
      return false;
  
    return true;
  });
  
  const [tab, setTab] = useState<"pozo" | "tabla">("pozo"); // pozo o tabla

  const [activePozo, setActivePozo] = useState<ActivePozo | null>(null);

  const [limit, setLimit] = useState(100);
  const [selectedPozoId, setSelectedPozoId] = useState<string | null>(null);
  const [pozoDetail, setPozoDetail] = useState<PozoDetail | null>(null);
  const [loadingPozo, setLoadingPozo] = useState(false);
  const tabButtonStyle = (active: boolean) => ({
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #3F6B4F",
    backgroundColor: active ? "#3F6B4F" : "transparent",
    color: active ? "#F3EEE6" : "#3F6B4F",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });
  
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
        const { data } = json;

        const normalized: PozoDetail[] = Array.isArray(data)
          ? data
          : data
          ? [data]
          : [];

        setReservorio(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
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
      } catch {
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
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 28px",
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

      <div style={{ display: "flex", gap: 12, padding: "12px 24px" }}>
        <button
          style={tabButtonStyle(tab === "pozo")}
          onClick={() => setTab("pozo")}
        >
          Mapa
        </button>

        <button
          style={tabButtonStyle(tab === "tabla")}
          onClick={() => setTab("tabla")}
        >
          Tabla
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "12px 24px"}}>
        <select
          value={filters.provincia}
          onChange={(e) =>
            setFilters({ ...filters, provincia: e.target.value })
          }
          className="select-filter"
        >
          <option value="ALL">Todas las provincias</option>
          {[...new Set(reservorio.map(p => p.provincia))].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filters.tipoestado}
          onChange={(e) =>
            setFilters({ ...filters, tipoestado: e.target.value })
          }
          className="select-filter"
        >
          <option value="ALL">Todos los estados</option>
          {[...new Set(reservorio.map(p => p.tipoestado))].map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          value={filters.empresa}
          onChange={(e) =>
            setFilters({ ...filters, empresa: e.target.value })
          }
          className="select-filter"
         
        >
          <option value="ALL">Todas las empresas</option>
          {[...new Set(reservorio.map(p => p.empresa))].map(emp => (
            <option key={emp} value={emp}>{emp}</option>
          ))}
        </select>
      </div>


      <main
        style={{
          display: "grid",
          gridTemplateColumns: tab === "pozo" ? "2fr 1fr" : "1fr",
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
              }}
            />
          </label>
        </div>
      {tab === "pozo" && (
      <>

        <div style={{ position: "relative" }}> 
          {/* Barra de estados flotante */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 10,
              display: "flex",
              gap: 14,
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 10,
              backgroundColor: "rgba(243,238,230,0.95)",
              fontSize: 13,
              color: colors.text,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {LEGEND_ITEMS.map((item) => (
              <LegendItem
                key={item.label}
                color={item.color}
                label={item.label}
              />
            ))}
          </div>

          <Map 
            initialViewState={{
              longitude: -68.059167,
              latitude: -38.951944,
              zoom: 6,
            }}
            style={{ width: "100%", height: 560, borderRadius: 14 }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={
              process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            }
          >
            {reservorioFiltrado.map((item: any) => {
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
                      width: selectedPozoId === item.idpozo ? 10 : 8,
                      height: selectedPozoId === item.idpozo ? 10 : 8,
                      backgroundColor:
                        selectedPozoId === item.idpozo
                          ? colors.accent
                          : getPozoColor(item.tipoestado),
                      borderRadius: "50%",
                      border: "1px solid rgba(0,0,0,0.3)",
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
                closeOnClick
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

        <div // Panel de detalles del pozo
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
            <p style={{ opacity: 0.8 }}>
              Seleccioná un pozo en el mapa
            </p>
          )}

          {loadingPozo && <p>Cargando información...</p>}

          {pozoDetail && !loadingPozo && (
            <>
              <h3
                style={{
                  marginBottom: 16,
                  color: colors.accent,
                }}
              >
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
                    <dt
                      style={{
                        color: colors.accent,
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </>
          )}
        </div>
      </> 
      )}

      {tab ===  "tabla" && (
        <TablaPozos
          data={reservorioFiltrado}
          onSelectedPozo={(idpozo) => setSelectedPozoId(idpozo)}
        />  
      )} 
      </main>
    </>
  );
}
