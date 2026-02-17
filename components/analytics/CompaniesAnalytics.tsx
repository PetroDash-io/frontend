'use client';

import React, { useState, useEffect } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompaniesBarChart } from "@/components/common/CompaniesBarChart";

export function CompaniesAnalytics() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [maxCompanies, setMaxCompanies] = useState<number>(7);
  const { companies, loading, error } = useCompanies(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Cargando empresas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error al cargar empresas: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Análisis de Empresas</h2>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.chartContainer}>
          <div style={styles.chartControls}>
            <label style={styles.sliderLabel}>
              Número de empresas: <strong>{maxCompanies}</strong>
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={maxCompanies}
              onChange={(e) => setMaxCompanies(Number(e.target.value))}
              style={styles.slider}
            />
          </div>
          <CompaniesBarChart 
            companies={companies} 
            title="Distribución de Pozos por Empresa"
            maxCompanies={maxCompanies}
          />
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total de Empresas</div>
            <div style={styles.statValue}>{companies.length}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total de Pozos</div>
            <div style={styles.statValue}>
              {companies.reduce((sum, company) => sum + company.cantidad_pozos, 0).toLocaleString('es-AR')}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Promedio por Empresa</div>
            <div style={styles.statValue}>
              {companies.length > 0
                ? Math.round(
                    companies.reduce((sum, company) => sum + company.cantidad_pozos, 0) / companies.length
                  ).toLocaleString('es-AR')
                : 0}
            </div>
          </div>
        </div>

        {companies.length > 0 && (
          <div style={styles.tableContainer}>
            <h3 style={styles.tableTitle}>Top 10 Empresas por Cantidad de Pozos</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Posición</th>
                  <th style={{...styles.tableHeader, textAlign: 'left'}}>Empresa</th>
                  <th style={{...styles.tableHeader, textAlign: 'right'}}>Cantidad de Pozos</th>
                  <th style={{...styles.tableHeader, textAlign: 'right'}}>% del Total</th>
                </tr>
              </thead>
              <tbody>
                {companies
                  .slice()
                  .sort((a, b) => b.cantidad_pozos - a.cantidad_pozos)
                  .slice(0, 10)
                  .map((company, index) => {
                    const totalWells = companies.reduce((sum, c) => sum + c.cantidad_pozos, 0);
                    const percentage = totalWells > 0 ? (company.cantidad_pozos / totalWells) * 100 : 0;
                    
                    return (
                      <tr key={`${company.empresa || 'unknown'}-${index}`} style={styles.tableRow}>
                        <td style={styles.tableCell}>{index + 1}</td>
                        <td style={{...styles.tableCell, textAlign: 'left', fontWeight: 500}}>
                          {company.empresa}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                          {company.cantidad_pozos.toLocaleString('es-AR')}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                          {percentage.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "16px",
  },
  searchContainer: {
    marginBottom: "16px",
  },
  searchInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px 16px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
  },
  content: {
    display: "grid",
    gap: "24px",
  },
  chartContainer: {
    width: "100%",
  },
  chartControls: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "16px 24px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  sliderLabel: {
    fontSize: "14px",
    color: "#374151",
    minWidth: "180px",
  },
  slider: {
    flex: 1,
    height: "6px",
    borderRadius: "3px",
    outline: "none",
    opacity: 0.9,
    cursor: "pointer",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  statLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#333",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  tableTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    borderBottom: "2px solid #e5e5e5",
  },
  tableHeader: {
    padding: "12px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },
  tableCell: {
    padding: "12px",
    textAlign: "center",
    fontSize: "14px",
    color: "#333",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  errorText: {
    fontSize: "16px",
    color: "#b91c1c",
  },
};
