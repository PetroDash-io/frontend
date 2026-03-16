"use client";

import React, {useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {Tabs, TabContent, TabTrigger} from "@/components/common/Tabs";
import {CompanyView} from "@/components/company/CompanyView";
import {WellView} from "@/components/wells/WellView";
import {WellProductionComparisonChart} from "@/components/wells/WellProductionComparisonChart";
import {TopProductionPieCharts} from "@/components/company/TopProductionPieCharts";
import styles from "./page.module.css";

function PozoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 5.5v13a2 2 0 01-2 2H8a2 2 0 01-2-2v-13"
        stroke="#2F3E34"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 8h12M6 12h12M6 16h12"
        stroke="#2F3E34"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22V7h16v15" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3v18h18" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14v5" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 10v9" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 6v13" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2h8v4a4 4 0 01-4 4 4 4 0 01-4-4V2z" stroke="#2F3E34" strokeWidth="2"/>
      <path d="M6 6h12v3a5 5 0 01-5 5h-2a5 5 0 01-5-5V6z" stroke="#2F3E34" strokeWidth="2"/>
      <path d="M9 18h6v4H9v-4z" stroke="#2F3E34" strokeWidth="2"/>
    </svg>
  );
}

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
                        <div className={styles.drawerHeader}>
                            <button
                                type="button"
                                className={styles.drawerToggle}
                                onClick={() => setIsDrawerOpen((value) => !value)}
                                aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {isDrawerOpen ? (
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                ) : (
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                )}
                            </svg>
                            </button>
                        </div>

                        <nav className={styles.drawerNav}>
                            <TabTrigger value="Well" variant="drawer" onSelect={closeDrawer}>
                                <span className={styles.icon} aria-hidden title="Pozo">
                                    <PozoIcon />
                                </span>
                                {isDrawerOpen && <span>Pozo</span>}
                            </TabTrigger>

                            <TabTrigger value="Production" variant="drawer" onSelect={closeDrawer}>
                                <span className={styles.icon} aria-hidden title="Empresas">
                                    <CompanyIcon />
                                </span>
                                {isDrawerOpen && <span>Empresas</span>}
                            </TabTrigger>
                            <TabTrigger value="Analysis" variant="drawer" onSelect={closeDrawer}>
                                <span className={styles.icon} aria-hidden title="Análisis de Producción">
                                    <ChartIcon />
                                </span>
                                {isDrawerOpen && <span>Análisis de Producción</span>}
                            </TabTrigger>
                            <TabTrigger value="Ranking" variant="drawer" onSelect={closeDrawer}>
                                <span className={styles.icon} aria-hidden title="Ranking por empresa">
                                    <TrophyIcon />
                                </span>
                                {isDrawerOpen && <span>Ranking por empresa</span>}
                            </TabTrigger>
                        </nav>
                    </aside>

                    <div
                        className={`${styles.contentArea} ${isDrawerOpen ? styles.contentAreaExpanded : styles.contentAreaCollapsed}`}
                    >
                        <TabContent value="Well">
                            <WellView/>
                        </TabContent>
                        <TabContent value="Production">
                            <CompanyView/>
                        </TabContent>
                        <TabContent value="Analysis">
                            <WellProductionComparisonChart/>
                        </TabContent>
                        <TabContent value="Ranking">
                            <TopProductionPieCharts/>
                        </TabContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
