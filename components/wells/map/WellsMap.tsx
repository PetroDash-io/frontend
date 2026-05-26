import {colors, LEGEND_ITEMS, CLASSIFICATION_LEGEND_ITEMS} from "@/utils/constants";
import {ActiveWell, WellDetail} from "@/app/types";
import {LegendItem} from "@/components/wells/map/LegendItem";
import {getWellColor} from "@/utils/helpers";

import Map, {Marker, Popup, Source, Layer} from "react-map-gl/mapbox";
import type {MapRef} from "react-map-gl/mapbox";
import type { HeatmapLayer } from "mapbox-gl";
import type { GeoJSON } from "geojson";
import React, {useEffect, useMemo, useRef, useState} from "react";

interface WellsMapProps {
  wells: WellDetail[];
  selectedWellId: number | null;
  onSelectWell: (id: number | null) => void;
  mapMode: "markers" | "heatmap";
  heatmapData?: GeoJSON.FeatureCollection | null;
  heatmapMaxValue?: number;
  overlayControlsTopRight?: React.ReactNode;
  overlayControlsBottomCenter?: React.ReactNode;
}

const isUnconventional = (well: WellDetail) =>
    well.resource_type?.toUpperCase().trim() === "NO CONVENCIONAL";

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
    const mapRef = useRef<MapRef | null>(null);
    const safeHeatmapMaxValue = Number.isFinite(heatmapMaxValue) && heatmapMaxValue > 0 ? heatmapMaxValue : 1;

    const wellsCoordinates = useMemo(() => {
        return wells
            .map((item) => {
                if (!item.geojson) return null;

                try {
                    const geo = typeof item.geojson === "string" ? JSON.parse(item.geojson) : item.geojson;
                    if (!geo?.coordinates || !Array.isArray(geo.coordinates) || geo.coordinates.length < 2) {
                        return null;
                    }

                    const [lon, lat] = geo.coordinates;
                    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

                    return {
                        wellId: item.well_id,
                        lon,
                        lat,
                        item,
                    };
                } catch {
                    return null;
                }
            })
            .filter((value): value is {wellId: number; lon: number; lat: number; item: WellDetail} => Boolean(value));
    }, [wells]);

    useEffect(() => {
        if (!mapRef.current || wellsCoordinates.length === 0) return;

        const randomIndex = Math.floor(Math.random() * wellsCoordinates.length);
        const randomWell = wellsCoordinates[randomIndex];

        mapRef.current.flyTo({
            center: [randomWell.lon, randomWell.lat],
            zoom: 6.2,
            duration: 800,
            essential: true,
        });
    }, [wellsCoordinates]);

    return (
        <div style={styles.mapContainer}>
            <div className="map-legend-bar" style={styles.legendBar}>
                <div style={styles.legendRow}>
                    {LEGEND_ITEMS.map((item) => (
                        <LegendItem key={item.label} color={item.color} label={item.label} />
                    ))}
                </div>
                <div style={styles.legendDivider} />
                <div style={styles.legendRow}>
                    {CLASSIFICATION_LEGEND_ITEMS.map((item) => (
                        <LegendItem key={item.label} shape={item.shape} label={item.label} />
                    ))}
                </div>
            </div>
            {overlayControlsTopRight ? <div style={styles.overlayControlsTopRight}>{overlayControlsTopRight}</div> : null}
            {overlayControlsBottomCenter ? <div style={styles.overlayControlsBottomCenter}>{overlayControlsBottomCenter}</div> : null}
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: -68.059167,
                    latitude: -38.951944,
                    zoom: 6,
                }}
                style={styles.map}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onClick={() => onSelectWell(null)}
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
                {mapMode === "markers" && wellsCoordinates.map(({wellId, lon, lat, item}) => {

                    const isSelected = selectedWellId === wellId;

                    return (
                        <Marker key={wellId} longitude={lon} latitude={lat} anchor="center">
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label={`${item.status || "Well"} ${wellId} ${isUnconventional(item) ? "no convencional" : "convencional"}`}
                                onMouseEnter={() => setActivePozo({id: wellId, lon, lat, company: item.company, resource_type: item.resource_type})}
                                onMouseLeave={() => setActivePozo(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectWell(wellId);
                                }}
                                onFocus={() => setFocusedPozoId(wellId)}
                                onBlur={() => setFocusedPozoId(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onSelectWell(wellId);
                                    }
                                }}
                                style={styles.markerWrap}>
                                {isUnconventional(item) ? (
                                    <span style={styles.markerTriangle({selected: isSelected, status: item.status, focused: focusedPozoId === wellId})} />
                                ) : (
                                    <span style={styles.markerDot({selected: isSelected, status: item.status, focused: focusedPozoId === wellId})} />
                                )}
                            </div>
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
        height: "clamp(420px, 60vh, 700px)",
        position: "relative",
    } as React.CSSProperties,
    legendBar: {
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        borderRadius: 10,
        backgroundColor: "rgba(243,238,230,0.95)",
        color: colors.text,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "8px 12px",
    } as React.CSSProperties,
    legendRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 14px",
        alignItems: "center",
    } as React.CSSProperties,
    legendDivider: {
        height: 1,
        width: "100%",
        background: "rgba(0,0,0,0.10)",
    } as React.CSSProperties,
    map: {
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-2xl)",
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
    markerWrap: {
        width: 18,
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
    } as React.CSSProperties,
    markerDot: (opts: { selected: boolean; status: string; focused: boolean }) => ({
        width: opts.selected ? 16 : 10,
        height: opts.selected ? 16 : 10,
        backgroundColor: getWellColor(opts.status),
        borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.4)",
        transition: "all 0.15s ease",
        boxShadow: opts.selected
            ? "0 0 0 4px rgba(45, 74, 45, 0.25), 0 1px 2px rgba(0,0,0,0.4)"
            : opts.focused
            ? `0 0 0 2px ${colors.accent}`
            : "0 1px 2px rgba(0,0,0,0.3)",
    }) as React.CSSProperties,
    markerTriangle: (opts: { selected: boolean; status: string; focused: boolean }) => {
        const color = getWellColor(opts.status);
        const halfBase = opts.selected ? 9 : 6;
        const height = opts.selected ? 16 : 11;
        const baseOutline = "drop-shadow(0 0 0.6px rgba(0,0,0,0.7))";
        const halo = opts.selected
            ? "drop-shadow(0 0 5px rgba(45, 74, 45, 0.55))"
            : opts.focused
            ? `drop-shadow(0 0 3px ${colors.accent})`
            : "drop-shadow(0 1px 1px rgba(0,0,0,0.3))";
        return {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderLeft: `${halfBase}px solid transparent`,
            borderRight: `${halfBase}px solid transparent`,
            borderBottom: `${height}px solid ${color}`,
            transition: "all 0.15s ease",
            filter: `${baseOutline} ${halo}`,
        } as React.CSSProperties;
    },
    popupBox: {
        backgroundColor: colors.panel,
        color: colors.textLight,
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 13,
        border: `1px solid ${colors.accent}`,
    } as React.CSSProperties,
} as const;
