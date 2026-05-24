import React from "react";
import { InlineMessage } from "@/components/common/InlineMessage";
import { colors } from "@/utils/constants";
import { useRouter } from "next/navigation";

type Props = {
  wells: any[];
  loading: boolean;
  error: string | null;
};

export function NearbyWellsSection({ wells, loading, error }: Props) {
  const router = useRouter();

  if (loading) {
    return <InlineMessage message="Cargando pozos cercanos..." />;
  }

  if (error) {
    return <InlineMessage message={error} variant="error" />;
  }

  if (!wells || wells.length === 0) {
    return <InlineMessage message="No hay pozos cercanos en este radio." />;
  }

  return (
    <div style={styles.container}>

      <div style={styles.list}>
        {wells.map((well) => (
          <div
            key={well.well_id}
            style={styles.item}
            onClick={() => router.push(`/analisis-pozo?wellId=${well.well_id}`)}
          >
            <div style={styles.row}>
              <span style={styles.id}>#{well.well_id}</span>
              <span style={styles.distance}>
                {Math.round(well.distance)} m
              </span>
            </div>

            <div style={styles.meta}>
              {well.area} · {well.province}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    marginTop: "16px",
    backgroundColor: "var(--color-bg-surface)",
    border: `1px solid ${colors.panelBorder}`,
    borderRadius: "8px",
    padding: "16px",
  },
  header: {
    marginBottom: "12px",
    borderBottom: "1px solid var(--color-border-subtle)",
    paddingBottom: "8px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "all 0.15s",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    fontWeight: 600,
  },
  id: {
    color: "var(--color-text-primary)",
  },
  distance: {
    color: colors.primary,
  },
  meta: {
    fontSize: "12px",
    color: "var(--color-text-secondary)",
  },
};