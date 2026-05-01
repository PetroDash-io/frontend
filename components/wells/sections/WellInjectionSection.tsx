import React from "react";
import {InlineMessage} from "@/components/common/InlineMessage";
import {LoadingState} from "@/components/common/LoadingState";
import {InjectionTimeSeries} from "@/components/wells/sections/InjectionTimeSeries";

interface CurveSeriesPoint {
  date: string;
  oil: number;
  gas: number;
  water: number;
  water_injection: number;
  gas_injection: number;
  co2_injection: number;
}

interface WellInjectionSectionProps {
  loading: boolean;
  error: string | null;
  data: CurveSeriesPoint[];
}

export function WellInjectionSection({loading, error, data}: WellInjectionSectionProps) {
  return (
    <>
      {loading && <LoadingState />}
      {error && <InlineMessage message={error} variant="error" />}
      {!loading && !error && <InjectionTimeSeries data={data} />}
    </>
  );
}
