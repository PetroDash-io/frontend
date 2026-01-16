"use client"
import { useEffect, useState } from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type ItemDeReservorio = Record<string, unknown>;

export default function Home() {
  const [reservorio, setReservorio] = useState<ItemDeReservorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = "https://petrodashbackend.onrender.com/ultimo";

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
  }, []);

  return (
    <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Reservorio</h1>
        <p style={{ color: "#555", marginTop: 4 }}>
          Latest data from petrodashbackend.onrender.com
        </p>
      </header>

      {loading && <p>Loading data...</p>}
      {error && !loading && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && reservorio.length === 0 && <p>No data available.</p>}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {!loading && !error &&
          reservorio.map((item, idx) => (
            <article
              key={idx}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: "16px",
                background: "#fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
              }}
            >
              <h2 style={{ fontSize: "18px", marginBottom: 8 }}>Registro {idx + 1}</h2>
              <dl style={{ margin: 0, display: "grid", rowGap: 6 }}>
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} style={{ display: "flex", gap: 8 }}>
                    <dt style={{ fontWeight: 600, minWidth: 110, textTransform: "capitalize" }}>
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd style={{ margin: 0, color: "#333" }}>
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value)
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
      </section>

      <div>
        <h2 style={{ marginTop: "32px", marginBottom: "16px", fontSize: "20px" }}>Map</h2>
        <Map
          initialViewState={{
            latitude: 37.7749,
            longitude: -122.4194,
            zoom: 10,
          }}
          style={{ width: "100%", height: 400, borderRadius: 12 }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        />
      </div>
    </main>
  );
}
