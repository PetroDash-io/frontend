import { colors, LEGEND_ITEMS } from "@/utils/constants";
import { ActivePozo, PozoDetail } from "@/app/types";
import { LegendItem } from "@/components/LegendItem";
import { getPozoColor } from "@/utils/helpers";

import Map, {Marker, Popup} from "react-map-gl/mapbox";
import React, {useState} from "react";

interface MyMapProps {
  reservorios: PozoDetail[];
  selectedPozoId: string | null;
  onSelectedPozo: (id: string) => void;
}

export function MyMap({ reservorios, selectedPozoId, onSelectedPozo }: MyMapProps) {
    const [focusedPozoId, setFocusedPozoId] = useState<string | null>(null);
    const [activePozo, setActivePozo] = useState<ActivePozo | null>(null);

    return (
        <div style={styles.mapContainer}>
            <div style={styles.legendBar}>
                {LEGEND_ITEMS.map((item) => (
                    <LegendItem key={item.label} color={item.color} label={item.label} />
                ))}
            </div>
            <Map
                initialViewState={{
                    longitude: -68.059167,
                    latitude: -38.951944,
                    zoom: 6,
                }}
                style={styles.map}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}>
                {reservorios.map((item) => {
                    if (!item.geojson) return null;

                    let lon: number, lat: number;
                    try {
                        const geo = JSON.parse(item.geojson);
                        [lon, lat] = geo.coordinates;
                    } catch {
                        return null;
                    }

                    const isSelected = selectedPozoId === item.well_id;

                    return (
                        <Marker key={item.well_id} longitude={lon} latitude={lat} anchor="center">
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label={`${item.status || "Well"} ${item.well_id}`}
                                onMouseEnter={() => setActivePozo({ id: item.well_id, lon, lat })}
                                onMouseLeave={() => setActivePozo(null)}
                                onClick={() => onSelectedPozo(item.well_id)}
                                onFocus={() => setFocusedPozoId(item.well_id)}
                                onBlur={() => setFocusedPozoId(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onSelectedPozo(item.well_id);
                                    }
                                }}
                                style={styles.markerDot({selected: isSelected, status: item.status, focused: focusedPozoId === item.well_id})}/>
                        </Marker>
                    );
                })}

                {activePozo && (
                    <Popup
                        longitude={activePozo.lon}
                        latitude={activePozo.lat}
                        closeButton={false}
                        closeOnClick
                        anchor="top"
                    >
                        <div style={styles.popupBox}>
                            <b>Pozo:</b> {activePozo.id}
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}


const styles = {
    mapContainer: {
        flex: 3,
        marginRight: 24
    } as React.CSSProperties,
    legendBar: {
        position: "relative",
        top: 50,
        width: "25%",
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
        borderRadius: 14,
    } as React.CSSProperties,
    markerDot: (opts: {selected: boolean; status: string, focused: boolean}) => ({
        width: opts.selected ? 10 : 8,
        height: opts.selected ? 10 : 8,
        backgroundColor: opts.selected ? colors.accent : getPozoColor(opts.status),
        borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.3)",
        cursor: "pointer",
        outline: "none",
        boxShadow: opts.focused ? `0 0 0 2px ${colors.accent}` : "none",
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