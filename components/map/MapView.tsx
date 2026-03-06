"use client";

import React, {useEffect, useMemo, useState} from "react";
import {toNumber} from "@/utils/helpers";
import {TimeSeriesChart} from "@/components/map/TimeSeriesChart";
import {WellInfo} from "@/components/map/WellInfo";
import {WellsMap} from "@/components/map/WellsMap";
import {useWells} from "@/hooks/useWells";
import {useWell} from "@/hooks/useWell";
import {useWellsProduction} from "@/hooks/useWellProduction";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
import {WellFilters} from "@/app/types/wellFilters";

type MapViewProps = {
  filters: WellFilters;
};

export function MapView({filters}: MapViewProps) {

  const {data: wells, loading: loadingWells, error: errorGettingWells} = useWells({filters});

  const [selectedWellId, setSelectedWellId] = useState<string | null>(null);

  const {data: selectedWellDetails, loading: loadingWell, error: errorGettingWellDetails} =
      useWell({wellId: selectedWellId});

  const {data: wellProduction, loading: loadingWellProduction, error: errorGettingWellProduction} =
      useWellsProduction({wellId: selectedWellId});

  const errorMessage =
      errorGettingWells ||
      errorGettingWellDetails ||
      errorGettingWellProduction ||
      null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
  }, [errorMessage]);

  const timeSeriesChartData = useMemo(() => {
    if (!wellProduction || wellProduction.length === 0) return null;

    return wellProduction
        .slice()
        .sort((a, b) =>
            a.reported_period_date.localeCompare(b.reported_period_date)
        )
        .map((record) => ({
          date: record.reported_period_date.slice(0, 7),
          oil: toNumber(record.oil_production) ?? 0,
          gas: toNumber(record.gas_production) ?? 0,
          water: toNumber(record.water_production) ?? 0,
        }));
  }, [wellProduction]);

  return (
      <>
        <div style={styles.wellDetailsContainer}>
          <WellsMap
              wells={wells || []}
              selectedWellId={selectedWellId}
              onSelectWell={setSelectedWellId}
          />

          <WellInfo
              wellInfo={selectedWellDetails}
              loadingWell={loadingWell}
          />
        </div>

        {loadingWellProduction && selectedWellId && (
            <div style={styles.loadingContainer}>
              <LoadingState/>
            </div>
        )}

        {wellProduction && (
            <TimeSeriesChart data={timeSeriesChartData}/>
        )}

        {errorMessage && (
            <div style={styles.errorMessageContainer}>
              <InlineMessage
                  message={errorMessage || "Unexpected error"}
                  variant="error"
              />
            </div>
        )}

        {loadingWells && (
            <div style={styles.loadingContainer}>
              <LoadingState/>
            </div>
        )}
      </>
  );
}

const styles = {
    filterPanel: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties,
    errorMessageContainer: {
        display: "flex"
    } as React.CSSProperties,
    loadingContainer: {
        display: "flex"
    } as React.CSSProperties,
    wellDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        height: 560
    } as React.CSSProperties,
} as const;
