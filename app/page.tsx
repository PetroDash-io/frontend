"use client";

import React, { useMemo, useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import { toNumber} from "@/utils/helpers";
import { PozoDetail, ProductionMonthly} from "@/app/types";
import { WellsTable } from "@/components/WellsTable";
import { CurveChart } from "@/components/CurveChart";

import { MyMap } from "@/components/MyMap";
import { MyInfoContainer } from "@/components/MyInfoContainer";
import { ProductionAnalytics } from "@/components/ProductionAnalytics";
import { WellsLimiter } from "@/components/WellsLimiter";
import { MyTabs, TabTrigger, TabContent } from "@/components/MyTabs";
import { WellProductionComparisonChart } from "@/components/WellProductionComparisonChart";

export default function Home() {
  const [reservoirs, setReservoirs] = useState<PozoDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
      province: "ALL",
      status: "ALL",
      company: "ALL",
  });

  const [selectedPozoId, setSelectedPozoId] = useState<string | null>(null);

  const [showCurve, setShowCurve] = useState(false);
  const [curveData, setCurveData] = useState<ProductionMonthly[] | null>(null);

  const filteredReservoirs = useMemo(() => {
      return reservoirs.filter((pozo) => {
          if (filters.province !== "ALL" && pozo.province !== filters.province) return false;
          if (filters.status !== "ALL" && pozo.status !== filters.status) return false;
          if (filters.company !== "ALL" && pozo.company !== filters.company) return false;
          return true;
      });
  }, [reservoirs, filters]);

  const provinces = useMemo(
      () => [...new Set(reservoirs.map((w) => w.province))].filter(Boolean),
      [reservoirs]
  );
  const statuses = useMemo(
      () => [...new Set(reservoirs.map((w) => w.status))].filter(Boolean),
      [reservoirs]
  );
  const companies = useMemo(
      () => [...new Set(reservoirs.map((w) => w.company))].filter(Boolean),
      [reservoirs]
  );

  const chartData = useMemo(() => {
      if (!curveData || curveData.length === 0) return null;

      return curveData
          .slice()
          .sort((a, b) => a.reported_period_date.localeCompare(b.reported_period_date))
          .map((record) => ({
              date: record.reported_period_date.slice(0, 7), // "YYYY-MM"
              oil: toNumber(record.oil_production) ?? 0,
              gas: toNumber(record.gas_production) ?? 0,
              water: toNumber(record.water_production) ?? 0,
          }));
  }, [curveData]);

  return (
    <>
      <header style={styles.header}>
          <img src="/logo-no-background.png" alt="PetroDash" style={styles.logo} />
          <h1 style={styles.title}>PetroDash</h1>
      </header>

      <MyTabs defaultValue="Map">
        <nav style={styles.topControlsRow}>
          <TabTrigger value="Map">Pozo</TabTrigger>
          <TabTrigger value="Table">Tabla</TabTrigger>
          <TabTrigger value="Production">Producción</TabTrigger>
          <TabTrigger value="Analysis">Análisis de Producción</TabTrigger>
        </nav>

        <br/>

        <TabContent value="Map">
          <div style={styles.topControlsRow}>
              <select
                  value={filters.province}
                  onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                  className="select-filter">
                  <option value="ALL">Todas las provincias</option>
                  {provinces.map((p) => (
                      <option key={p} value={p}>
                          {p}
                      </option>
                  ))}
              </select>

              <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="select-filter">
                  <option value="ALL">Todos los estados</option>
                  {statuses.map((s) => (
                      <option key={s} value={s}>
                          {s}
                      </option>
                  ))}
              </select>

              <select
                  value={filters.company}
                  onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                  className="select-filter">
                  <option value="ALL">Todas las empresas</option>
                  {companies.map((emp) => (
                      <option key={emp} value={emp}>
                          {emp}
                      </option>
                  ))}
              </select>
          </div>

          <WellsLimiter setReservoirs={setReservoirs} setLoading={setLoading} setError={setError} />

          <div style={styles.wellDetailsContainer}>
              <MyMap reservorios={filteredReservoirs} selectedPozoId={selectedPozoId} onSelectedPozo={setSelectedPozoId} />
              <MyInfoContainer selectedPozoId={selectedPozoId} showCurve={showCurve} curveData={curveData} onShowCurve={setShowCurve} onCurveData={setCurveData} />
          </div>

          {error && (
            <div style={styles.errorMessageContainer}>
              <p style={{ color: "#b91c1c" }}>Error: {error}</p>
            </div>
          )}

          {loading && (
            <div style={styles.loadingContainer}>
              <p>Cargando pozos...</p>
            </div>
          )}

          {showCurve && selectedPozoId && chartData && (
            <CurveChart data={chartData} />
          )}
        </TabContent>
        
        <TabContent value="Table">
          <div style={styles.topControlsRow}>
              <select
                  value={filters.province}
                  onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                  className="select-filter">
                  <option value="ALL">Todas las provincias</option>
                  {provinces.map((p) => (
                      <option key={p} value={p}>
                          {p}
                      </option>
                  ))}
              </select>

              <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="select-filter">
                  <option value="ALL">Todos los estados</option>
                  {statuses.map((s) => (
                      <option key={s} value={s}>
                          {s}
                      </option>
                  ))}
              </select>

              <select
                  value={filters.company}
                  onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                  className="select-filter">
                  <option value="ALL">Todas las empresas</option>
                  {companies.map((emp) => (
                      <option key={emp} value={emp}>
                          {emp}
                      </option>
                  ))}
              </select>
          </div>
          
          <WellsLimiter setReservoirs={setReservoirs} setLoading={setLoading} setError={setError} />

          <WellsTable data={filteredReservoirs} onSelectedPozo={(well_id) => setSelectedPozoId(well_id)} />
          
          {error && (
            <div style={styles.errorMessageContainer}>
              <p style={{ color: "#b91c1c" }}>Error: {error}</p>
            </div>
          )}

          {loading && (
            <div style={styles.loadingContainer}>
              <p>Cargando pozos...</p>
            </div>
          )}

          {showCurve && selectedPozoId && chartData && (
            <CurveChart data={chartData} />
          )}
        </TabContent>
        <TabContent value="Production">
          <ProductionAnalytics />
        </TabContent>

        <TabContent value="Analysis">
          <WellProductionComparisonChart />
        </TabContent>
      </MyTabs>
    </>
  );
}

const styles = {
  header: {
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "0 28px",
    background: "linear-gradient(90deg, #3F6B4F, #4B2A1A)",
  } as React.CSSProperties,
  logo: {
    height: "100%",
    transform: "scale(1.3)",
    transformOrigin: "left center",
  } as React.CSSProperties,
  title: {
    fontSize: 22,
    fontWeight: 600,
    color: "#F3EEE6",
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  topControlsRow: {
    display: "flex",
    gap: 12,
    padding: "12px 24px",
  } as React.CSSProperties,
  wellDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    height: 560
  } as React.CSSProperties,
  errorMessageContainer: {
    display: "flex"
  } as React.CSSProperties,
  loadingContainer: {
    display: "flex"
  } as React.CSSProperties,
} as const;