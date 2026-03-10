"use client";

import React, {useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {CompanyView} from "@/components/company/CompanyView";
import {Tabs, TabContent, TabTrigger} from "@/components/common/Tabs";
import { WellView } from "@/components/wells/WellView"; // Update the path to match the actual file structure
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

            <Tabs defaultValue="Well">
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
                            <TabTrigger value="Well" variant="drawer" onSelect={closeDrawer}>Pozo</TabTrigger>

                            <TabTrigger value="Production" variant="drawer" onSelect={closeDrawer}>Empresas</TabTrigger>
                            <TabTrigger value="Analysis" variant="drawer" onSelect={closeDrawer}>Análisis de
                                Producción</TabTrigger>
                        </nav>
                    </aside>

                    <div className={styles.contentArea}>
                        <TabContent value="Well">
                            <WellView/>
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
