import React from "react";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {ProductionTimeSeries} from "@/components/well-analysis/production/ProductionTimeSeries";

interface CurveSeriesPoint {
  date: string;
  oil: number;
  gas: number;
  water: number;
  water_injection: number;
  gas_injection: number;
  co2_injection: number;
}

interface WellProductionSectionProps {
  loading: boolean;
  error: string | null;
  data: CurveSeriesPoint[];
}

export function WellProductionSection({loading, error, data}: WellProductionSectionProps) {
  return (
    <>
      {loading && <LoadingState />}
      {error && <InlineMessage message={error} variant="error" />}
      {!loading && !error && <ProductionTimeSeries data={data} />}
    </>
  );
}
