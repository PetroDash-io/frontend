"use client";

import React, {useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {CompanyView} from "@/components/company/CompanyView";
import {Tabs, TabContent, TabTrigger} from "@/components/common/Tabs";
import {TableView} from "@/components/table/TableView";
import {MapView} from "@/components/map/MapView";
import {WellProductionComparisonChart} from "@/components/wells/WellProductionComparisonChart";
import styles from "./page.module.css";

export default function Home() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className={styles.pageShell}>
            <header className={styles.header}>
                <img src="/logo-no-background.png" alt="PetroDash" className={styles.logo}/>
                <h1 className={styles.title}>PetroDash</h1>
                <button
                    className={styles.menuButton}
                    onClick={() => setIsDrawerOpen((value) => !value)}
                    aria-expanded={isDrawerOpen}
                    aria-controls="dashboard-navigation"
                    type="button"
                >
                    Menu
                </button>
            </header>

            <Tabs defaultValue="Map">
                <div className={styles.dashboardLayout}>
                    <div
                        className={`${styles.drawerBackdrop} ${isDrawerOpen ? styles.drawerBackdropVisible : ""}`}
                        onClick={closeDrawer}
                        aria-hidden="true"
                    />

                    <aside
                        id="dashboard-navigation"
                        className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ""}`}
                    >
                        <nav className={styles.drawerNav}>
                            <TabTrigger value="Map" variant="drawer" onSelect={closeDrawer}>Pozo</TabTrigger>
                            <TabTrigger value="Table" variant="drawer" onSelect={closeDrawer}>Tabla</TabTrigger>
                            <TabTrigger value="Production" variant="drawer" onSelect={closeDrawer}>Empresas</TabTrigger>
                            <TabTrigger value="Analysis" variant="drawer" onSelect={closeDrawer}>Análisis de
                                Producción</TabTrigger>
                        </nav>
                    </aside>

                    <div className={styles.contentArea}>
                        <TabContent value="Map">
                            <MapView/>
                        </TabContent>
                        <TabContent value="Table">
                            <TableView/>
                        </TabContent>
                        <TabContent value="Production">
                            <CompanyView/>
                        </TabContent>
                        <TabContent value="Analysis">
                            <WellProductionComparisonChart/>
                        </TabContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
