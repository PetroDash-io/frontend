"use client";
import {Suspense} from "react";
import {WellAnalysisView} from "@/components/well-analysis/WellAnalysisView";

export default function AnalisisPozoPage() {
  return (
    <Suspense fallback={null}>
      <WellAnalysisView />
    </Suspense>
  );
}
