import React from "react";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {AccumulatedProductionTimeSeries} from "@/components/well-analysis/production/AccumulatedProductionTimeSeries";

interface AccumulatedSeriesPoint {
  date: string;
  cumulative_oil_production?: number | null;
  cumulative_gas_production?: number | null;
  cumulative_water_production?: number | null;
}

interface AccumulatedProductionSectionProps {
  loading: boolean;
  error: string | null;
  data: AccumulatedSeriesPoint[];
}

export function AccumulatedProductionSection({loading, error, data}: AccumulatedProductionSectionProps) {
  return (
    <>
      {loading && <LoadingState />}
      {error && <InlineMessage message={error} variant="error" />}
      {!loading && !error && <AccumulatedProductionTimeSeries data={data} />}
    </>
  );
}
