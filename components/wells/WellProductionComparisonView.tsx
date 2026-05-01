import React, {useMemo, useState} from "react";
import {colors} from "@/utils/constants";
import {InlineMessage} from "@/components/common/InlineMessage";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {DateRangeFilters} from "@/components/map/DateRangeFilters";
import {DateRangeValue, DEFAULT_WELL_CHART_DATE_RANGE, getValidatedDateRange,} from "@/utils/dateRange";
import {CollapsiblePanel} from "@/components/wells/sections/CollapsiblePanel";
import {WellProductionSection} from "@/components/wells/sections/WellProductionSection";
import {WellAnomaliesSection} from "@/components/wells/sections/WellAnomaliesSection";
import {WellInjectionSection} from "@/components/wells/sections/WellInjectionSection";
import {AnomalyMethodInfoButton} from "@/components/map/anomalies/AnomalyMethodInfoButton";
import {WellComparisonSection} from "@/components/wells/sections/WellComparisonSection";

export function WellProductionComparisonView() {
  const [wellId, setWellId] = useState<number | null>(null);
  const [wellIdInput, setWellIdInput] = useState("");
  const [wellIdInputError, setWellIdInputError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>(DEFAULT_WELL_CHART_DATE_RANGE);
  const [openSections, setOpenSections] = useState({
    anomalies: false,
    injection: false,
    comparison: false,
  });

  const validatedDateRange = useMemo(() => getValidatedDateRange(dateRange), [dateRange]);

  const {
    data: wellProduction,
    loading: loadingWellProduction,
    error: errorInWellProduction,
  } = useWellsProduction({wellId, dateRange: validatedDateRange});

  const curveSeriesData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) {
      return [];
    }

    return wellProduction
      .slice()
      .sort((a, b) => a.data_date.localeCompare(b.data_date))
      .map((record) => ({
        date: record.data_date.slice(0, 7),
        oil: Number(record.oil_production) || 0,
        gas: Number(record.gas_production) || 0,
        water: Number(record.water_production) || 0,
        water_injection: Number(record.water_injection) || 0,
        gas_injection: Number(record.gas_injection) || 0,
        co2_injection: Number(record.co2_injection) || 0,
      }));
  }, [wellProduction]);

  const handleApplyWellId = () => {
    const value = wellIdInput.trim();
    if (value === "") {
      setWellId(null);
      setWellIdInputError(null);
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setWellId(parsed);
      setWellIdInputError(null);
      return;
    }

    setWellIdInputError("Ingresá un ID de pozo válido.");
  };

  const updateDateRange = (filterName: string, value: unknown) => {
    setDateRange((previousValues) => ({...previousValues, [filterName]: value}));
  };

  const toggleSection = (sectionName: "anomalies" | "injection" | "comparison") => {
    setOpenSections((previous) => ({...previous, [sectionName]: !previous[sectionName]}));
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.mainTitle}>Análisis de producción por pozo</h2>
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.cardHeader}>
          <span className="card-label">Filtros</span>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.wellIdFieldContainer}>
            <label style={styles.label}>
              ID del Pozo:
              <input
                type="number"
                value={wellIdInput}
                onChange={(e) => {
                  setWellIdInput(e.target.value);
                  if (wellIdInputError) {
                    setWellIdInputError(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyWellId();
                  }
                }}
                placeholder="Ingrese ID del pozo"
                style={styles.input}
              />
            </label>
          </div>
          <button type="button" style={styles.searchButton} onClick={handleApplyWellId}>
            Buscar
          </button>
        </div>

        {wellIdInputError && <InlineMessage message={wellIdInputError} variant="warning" />}

        <div style={styles.filterRow}>
          <DateRangeFilters
            value={dateRange}
            onChange={updateDateRange}
            isStartRangeIncomplete={false}
            isEndRangeIncomplete={false}
          />
        </div>
      </div>

      {!wellId && (
        <InlineMessage message="Ingrese un ID de pozo para ver el análisis de producción." />
      )}

      {wellId && (
        <>
          <div style={styles.stablePanelWithSurface}>
            <div style={styles.cardHeader}>
              <span className="card-label">Curva de producción</span>
            </div>
            <WellProductionSection
              loading={loadingWellProduction}
              error={errorInWellProduction}
              data={curveSeriesData}
            />
          </div>

          <div style={styles.collapsibleStack}>
            <CollapsiblePanel
              title="Anomalías"
              isOpen={openSections.anomalies}
              onToggle={() => toggleSection("anomalies")}
              headerAction={<AnomalyMethodInfoButton />}
            >
              <WellAnomaliesSection
                wellId={wellId}
                dateRange={validatedDateRange}
                production={wellProduction}
                productionLoading={loadingWellProduction}
                productionError={errorInWellProduction}
              />
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Curva de inyección"
              isOpen={openSections.injection}
              onToggle={() => toggleSection("injection")}
            >
              <WellInjectionSection
                loading={loadingWellProduction}
                error={errorInWellProduction}
                data={curveSeriesData}
              />
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Comparación"
              isOpen={openSections.comparison}
              onToggle={() => toggleSection("comparison")}
            >
              <WellComparisonSection wellId={wellId} dateRange={validatedDateRange} />
            </CollapsiblePanel>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    width: "100%",
    minHeight: "calc(100vh - 200px)",
  } as React.CSSProperties,
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  } as React.CSSProperties,
  mainTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: colors.primary,
    margin: 0,
  } as React.CSSProperties,
  filtersContainer: {
    backgroundColor: colors.filtersBg,
    padding: "24px",
    borderRadius: "8px",
    marginBottom: "24px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  cardHeader: {
    paddingBottom: "12px",
    marginBottom: "12px",
    borderBottom: "1px solid var(--color-border-subtle)",
  } as React.CSSProperties,
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  } as React.CSSProperties,
  wellIdFieldContainer: {
    flex: 1,
    minWidth: "150px",
  } as React.CSSProperties,
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
    flex: "1",
    minWidth: "150px",
  } as React.CSSProperties,
  input: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: `1px solid ${colors.panelBorder}`,
    fontSize: "14px",
    minWidth: "120px",
  } as React.CSSProperties,
  searchButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    height: "40px",
    backgroundColor: "var(--color-brand-primary)",
    color: "var(--color-text-inverse)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-end",
  } as React.CSSProperties,
  stablePanelWithSurface: {
    minHeight: "420px",
    marginTop: "24px",
    backgroundColor: "var(--color-bg-surface)",
    padding: "24px",
    borderRadius: "8px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  collapsibleStack: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  } as React.CSSProperties,
};

export function AnalysisIcon({width = 18, height = 18}: {width?: number; height?: number}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 6v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
