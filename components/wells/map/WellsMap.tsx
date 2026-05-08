import {colors, LEGEND_ITEMS} from "@/utils/constants";
import {ActiveWell, WellDetail} from "@/app/types";
import {LegendItem} from "@/components/wells/map/LegendItem";
import {getWellColor} from "@/utils/helpers";

import Map, {Marker, Popup, Source, Layer} from "react-map-gl/mapbox";
import type { HeatmapLayer } from "mapbox-gl";
import type { GeoJSON } from "geojson";
import React, {useState} from "react";

interface WellsMapProps {
  wells: WellDetail[];
  selectedWellId: number | null;
  onSelectWell: (id: number) => void;
  mapMode: "markers" | "heatmap";
  heatmapData?: GeoJSON.FeatureCollection | null;
  heatmapMaxValue?: number;
  overlayControlsTopRight?: React.ReactNode;
  overlayControlsBottomCenter?: React.ReactNode;
}

export function WellsMap({
    wells,
    selectedWellId,
    onSelectWell,
    mapMode,
    heatmapData,
    heatmapMaxValue = 1,
    overlayControlsTopRight,
    overlayControlsBottomCenter,
}: WellsMapProps) {
    const [focusedPozoId, setFocusedPozoId] = useState<number | null>(null);
    const [activePozo, setActivePozo] = useState<ActiveWell | null>(null);
    const safeHeatmapMaxValue = Number.isFinite(heatmapMaxValue) && heatmapMaxValue > 0 ? heatmapMaxValue : 1;

    return (
        <div style={styles.mapContainer}>
            <div style={styles.legendBar}>
                {LEGEND_ITEMS.map((item) => (
                    <LegendItem key={item.label} color={item.color} label={item.label} />
                ))}
            </div>
            {overlayControlsTopRight ? <div style={styles.overlayControlsTopRight}>{overlayControlsTopRight}</div> : null}
            {overlayControlsBottomCenter ? <div style={styles.overlayControlsBottomCenter}>{overlayControlsBottomCenter}</div> : null}
            <Map
                initialViewState={{
                    longitude: -68.059167,
                    latitude: -38.951944,
                    zoom: 6,
                }}
                style={styles.map}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}>

                {/* Heatmap layer */}
                {mapMode === "heatmap" && heatmapData && (
                    <Source id="heatmap-source" type="geojson" data={heatmapData}>
                        <Layer
                            {...({
                                id: "heatmap-layer",
                                type: "heatmap",
                                paint: {
                                    "heatmap-weight": [
                                        "interpolate", ["linear"],
                                        ["get", "value"],
                                        0, 0,
                                        safeHeatmapMaxValue, 1,
                                    ],
                                    "heatmap-intensity": [
                                        "interpolate", ["linear"], ["zoom"],
                                        5, 1,
                                        12, 4,
                                    ],
                                    "heatmap-color": [
                                        "interpolate", ["linear"], ["heatmap-density"],
                                        0,   "rgba(0,0,0,0)",
                                        0.2, "#5ba3cc",
                                        0.4, "#3a7fa8",
                                        0.6, "#e8a030",
                                        0.8, "#c47d0e",
                                        1,   "#c0392b",
                                    ],
                                    "heatmap-radius": [
                                        "interpolate", ["linear"], ["zoom"],
                                        5, 20,
                                        12, 40,
                                    ],
                                    "heatmap-opacity": 0.85,
                                },
                            } as unknown as HeatmapLayer)}
                        />
                    </Source>
                )}

                {/* Markers layer */}
                {mapMode === "markers" && wells.map((item) => {
                    if (!item.geojson) return null;

                    let lon: number, lat: number;
                    try {
                        const geo = typeof item.geojson === "string" ? JSON.parse(item.geojson) : item.geojson;
                        if (!geo?.coordinates || !Array.isArray(geo.coordinates) || geo.coordinates.length < 2) {
                            return null;
                        }
                        [lon, lat] = geo.coordinates;
                    } catch {
                        return null;
                    }

                    const wellId = item.well_id;

                    const isSelected = selectedWellId === wellId;

                    return (
                        <Marker key={wellId} longitude={lon} latitude={lat} anchor="center">
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label={`${item.status || "Well"} ${wellId}`}
                                onMouseEnter={() => setActivePozo({id: wellId, lon, lat, company: item.company, resource_type: item.resource_type})}
                                onMouseLeave={() => setActivePozo(null)}
                                onClick={() => onSelectWell(wellId)}
                                onFocus={() => setFocusedPozoId(wellId)}
                                onBlur={() => setFocusedPozoId(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onSelectWell(wellId);
                                    }
                                }}
                                style={styles.markerDot({selected: isSelected, status: item.status, focused: focusedPozoId === wellId})}/>
                        </Marker>
                    );
                })}

                {mapMode === "markers" && activePozo && (
                    <Popup
                        longitude={activePozo.lon}
                        latitude={activePozo.lat}
                        closeButton={false}
                        closeOnClick
                        anchor="top">
                        <div style={styles.popupBox}>
                            <b>Pozo:</b> {activePozo.id}
                            <br />
                            {activePozo.company || "Sin empresa"}
                            <br />
                            <b>{activePozo.resource_type || "Sin recurso"}</b>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}


const styles = {
    mapContainer: {
        minWidth: 0,
        height: "100%",
        position: "relative",
    } as React.CSSProperties,
    legendBar: {
        position: "absolute",
        top: 12,
        width: "30%",
        left: 12,
        zIndex: 10,
        display: "flex",
        flexDirection: "row",
        gap: 14,
        justifyContent: "center",
        padding: "8px 12px",
        borderRadius: 10,
        backgroundColor: "rgba(243,238,230,0.95)",
        fontSize: 13,
        color: colors.text,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    } as React.CSSProperties,
    map: {
        width: "100%",
        height: "100%",
        borderRadius: 14,
    } as React.CSSProperties,
    overlayControlsTopRight: {
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
    } as React.CSSProperties,
    overlayControlsBottomCenter: {
        position: "absolute",
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        zIndex: 10,
    } as React.CSSProperties,
    markerDot: (opts: { selected: boolean; status: string; focused: boolean }) => ({
        width: opts.selected ? 14 : 8,
        height: opts.selected ? 14 : 8,
        backgroundColor: getWellColor(opts.status),
        borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.3)",
        cursor: "pointer",
        outline: "none",

        transform: opts.selected ? "scale(1.4)" : "scale(1)",
        transition: "all 0.15s ease",

        boxShadow: opts.selected
            ? "0 0 0 4px rgba(0, 123, 255, 0.25)" // halo
            : opts.focused
            ? `0 0 0 2px ${colors.accent}`
            : "none",

        zIndex: opts.selected ? 10 : 1,
    }) as React.CSSProperties,
    popupBox: {
        backgroundColor: colors.panel,
        color: colors.textLight,
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 13,
        border: `1px solid ${colors.accent}`,
    } as React.CSSProperties,
} as const;
