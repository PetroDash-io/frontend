import React, {useEffect, useMemo, useState} from "react";
import {colors, CONTENT_MAX_WIDTH} from "@/utils/constants";
import {InlineMessage} from "@/components/common/InlineMessage";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {DateRangeFilters} from "@/components/common/DateRangeFilters";
import {DateRangeValue, DEFAULT_WELL_CHART_DATE_RANGE, getValidatedDateRange,} from "@/utils/dateRange";
import {CollapsiblePanel} from "@/components/well-analysis/common/CollapsiblePanel";
import {WellProductionSection} from "@/components/well-analysis/production/WellProductionSection";
import {AccumulatedProductionSection} from "@/components/well-analysis/production/AccumulatedProductionSection";
import {WellAnomaliesSection} from "@/components/well-analysis/anomalies/WellAnomaliesSection";
import {WellInjectionSection} from "@/components/well-analysis/injection/WellInjectionSection";
import {AnomalyInfoButton} from "@/components/well-analysis/anomalies/AnomalyInfoButton";
import {WellComparisonSection} from "@/components/well-analysis/comparison/WellComparisonSection";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useWell} from "@/hooks/useWell";
import {WellSummaryChips} from "@/components/well-analysis/WellSummaryChips";
import { MonthlyAggregatedSection } from "@/components/well-analysis/production/MonthlyAggregatedSection";

export function WellAnalysisView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [wellId, setWellId] = useState<number | null>(null);
  const [wellIdInput, setWellIdInput] = useState("");
  const [wellIdInputError, setWellIdInputError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>(DEFAULT_WELL_CHART_DATE_RANGE);
  const [queryDateRange, setQueryDateRange] = useState<DateRangeValue>(DEFAULT_WELL_CHART_DATE_RANGE);
  const [openSections, setOpenSections] = useState({
    accumulated: true,
    anomalies: false,
    injection: false,
    comparison: false,
    aggregated: false,
  });

  const validatedDateRange = useMemo(() => getValidatedDateRange(queryDateRange), [queryDateRange]);

  useEffect(() => {
    const queryWellId = searchParams.get("wellId");
    if (!queryWellId) {
      return;
    }

    const parsed = parseInt(queryWellId.trim(), 10);
    if (isNaN(parsed) || parsed <= 0) {
      return;
    }

    setWellId(parsed);
    setWellIdInput(String(parsed));
    setWellIdInputError(null);
  }, [searchParams]);

  const {
    data: wellProduction,
    loading: loadingWellProduction,
    error: errorInWellProduction,
  } = useWellsProduction({wellId, dateRange: validatedDateRange});

  const {
    data: wellDetails,
    loading: loadingWellDetails,
    error: errorGettingWellDetails,
  } = useWell({wellId});

  const curveSeriesData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) {
      return [];
    }

    return wellProduction
      .filter((r) => r.data_date)
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

  const accumulatedSeriesData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) {
      return [];
    }

    return wellProduction
      .filter((r) => r.data_date)
      .slice()
      .sort((a, b) => a.data_date.localeCompare(b.data_date))
      .map((record) => ({
        date: record.data_date.slice(0, 7),
        cumulative_oil_production: record.cumulative_oil_production ?? null,
        cumulative_gas_production: record.cumulative_gas_production ?? null,
        cumulative_water_production: record.cumulative_water_production ?? null,
      }));
  }, [wellProduction]);

  const handleViewProduction = () => {
    const value = wellIdInput.trim();
    if (value === "") {
      setWellId(null);
      setWellIdInputError(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("wellId");
      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setWellId(parsed);
      setQueryDateRange(dateRange);
      setOpenSections({
        accumulated: true,
        anomalies: false,
        injection: false,
        comparison: false,
        aggregated: false,
      });
      setWellIdInputError(null);
      const params = new URLSearchParams(searchParams.toString());
      params.set("wellId", String(parsed));
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }

    setWellIdInputError("Ingresá un ID de pozo válido.");
  };

  const updateDateRange = (filterName: string, value: unknown) => {
    setDateRange((previousValues) => ({...previousValues, [filterName]: value}));
  };

  const isWellIdInputValid = (() => {
    const value = wellIdInput.trim();
    const parsed = parseInt(value, 10);
    return value !== "" && !isNaN(parsed) && parsed > 0;
  })();

  const toggleSection = (sectionName: "accumulated" | "anomalies" | "injection" | "comparison" | "aggregated") => {
    setOpenSections((previous) => ({...previous, [sectionName]: !previous[sectionName]}));
  };

  const handleWellIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWellIdInput(e.target.value);
    if (wellIdInputError) {
      setWellIdInputError(null);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.mainTitle}>Análisis de producción por pozo</h2>
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.compactFilterHeaderRow}>
          <span className="card-label">Filtros</span>
        </div>

        <div style={styles.filterToolbarRow}>
          <div style={styles.wellIdFieldContainer}>
            <label style={styles.label}>
              ID del Pozo
              <input
                type="number"
                value={wellIdInput}
                onChange={handleWellIdChange}
                placeholder="Ingrese ID"
                style={styles.input}
              />
            </label>
          </div>

          <div style={styles.dateRangeInlineContainer}>
            <DateRangeFilters
              value={dateRange}
              onChange={updateDateRange}
              isStartRangeIncomplete={false}
              isEndRangeIncomplete={false}
            />
          </div>

          <button
            type="button"
            style={{
              ...styles.searchButton,
              ...(isWellIdInputValid ? {} : styles.searchButtonDisabled),
            }}
            onClick={handleViewProduction}
            disabled={!isWellIdInputValid}
          >
            Ver producción
          </button>
        </div>

        {wellIdInputError && <InlineMessage message={wellIdInputError} variant="warning" />}
      </div>

      {!wellId && (
        <InlineMessage message="Ingrese un ID de pozo para ver el análisis de producción." />
      )}

      {wellId && (
        <>
          <WellSummaryChips
            wellDetails={wellDetails}
            loading={loadingWellDetails}
            error={errorGettingWellDetails}
          />

          <div style={styles.productionPanelWithSurface}>
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
              title="Producción acumulada"
              isOpen={openSections.accumulated}
              onToggle={() => toggleSection("accumulated")}
            >
              <AccumulatedProductionSection
                loading={loadingWellProduction}
                error={errorInWellProduction}
                data={accumulatedSeriesData}
              />
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Anomalías"
              isOpen={openSections.anomalies}
              onToggle={() => toggleSection("anomalies")}
              headerAction={<AnomalyInfoButton />}
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


            <CollapsiblePanel
              title="Curva agregada"
              isOpen={openSections.aggregated}
              onToggle={() => toggleSection("aggregated")}
            >
              <MonthlyAggregatedSection />
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
    maxWidth: CONTENT_MAX_WIDTH,
    margin: "0 auto",
    boxSizing: "border-box",
    minWidth: 0,
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
    padding: "14px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  compactFilterHeaderRow: {
    paddingBottom: "8px",
    marginBottom: "10px",
    borderBottom: "1px solid var(--color-border-subtle)",
  } as React.CSSProperties,
  filterToolbarRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  } as React.CSSProperties,
  wellIdFieldContainer: {
    minWidth: 180,
  } as React.CSSProperties,
  dateRangeInlineContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    flexWrap: "nowrap",
    flex: 1,
    minWidth: 420,
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
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 500,
    color: colors.text,
    minWidth: "140px",
  } as React.CSSProperties,
  input: {
    padding: "8px 10px",
    borderRadius: "4px",
    border: `1px solid ${colors.panelBorder}`,
    fontSize: "13px",
    minWidth: "130px",
    height: "40px",
  } as React.CSSProperties,
  searchButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    height: "40px",
    backgroundColor: "var(--color-brand-primary)",
    color: "var(--color-text-inverse)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  searchButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  } as React.CSSProperties,
  productionPanelWithSurface: {
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
