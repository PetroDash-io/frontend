"use client";

import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {CompanyView} from "@/components/company/CompanyView";
import {Tabs, TabContent, TabTrigger} from "@/components/common/Tabs";
import {TableView} from "@/components/table/TableView";
import {MapView} from "@/components/map/MapView";
import { WellProductionComparisonChart } from "@/components/wells/WellProductionComparisonChart";
import { TopProductionPieCharts } from "@/components/company/TopProductionPieCharts";

export default function Home() {
    return (
        <>
            <header style={styles.header}>
                <img src="/logo-no-background.png" alt="PetroDash" style={styles.logo}/>
                <h1 style={styles.title}>PetroDash</h1>
            </header>

            <Tabs defaultValue="Map">
                <nav style={styles.tabButtonsContainer}>
                    <TabTrigger value="Map">Pozo</TabTrigger>
                    <TabTrigger value="Table">Tabla</TabTrigger>
                    <TabTrigger value="Production">Empresas</TabTrigger>
                    <TabTrigger value="Analysis">Análisis de Producción</TabTrigger>
                </nav>
                <br/>
                <TabContent value="Map">
                    <MapView/>
                </TabContent>
                <TabContent value="Table">
                    <TableView/>
                </TabContent>
                <TabContent value="Production">
                    <CompanyView/></TabContent>
                <TabContent value="Analysis">
                    <div style={styles.analysisContainer}>
                        <TopProductionPieCharts />
                        <div style={styles.divider} />
                        <WellProductionComparisonChart />
                    </div>
                </TabContent>
            </Tabs>
        </>
    );
}

const styles = {
    header: {
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 28px",
        background: "linear-gradient(90deg, #3F6B4F, #4B2A1A)",
    } as React.CSSProperties,
    logo: {
        height: "100%",
        transform: "scale(1.3)",
        transformOrigin: "left center",
    } as React.CSSProperties,
    title: {
        fontSize: 22,
        fontWeight: 600,
        color: "#F3EEE6",
        letterSpacing: "0.5px",
    } as React.CSSProperties,
    tabButtonsContainer: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties,
} as const;