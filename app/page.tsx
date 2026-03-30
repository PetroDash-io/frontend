"use client";

import React, {useState} from "react";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import {Tabs, TabContent, TabTrigger} from "@/components/common/Tabs";
import {WellView, WellIcon} from "@/components/wells/WellView";
import {CompanyView, CompanyIcon} from "@/components/company/CompanyView";
import {WellProductionComparisonView, AnalysisIcon} from "@/components/wells/WellProductionComparisonView";
import {CompanyRankingView, RankingIcon} from "@/components/company/CompanyRankingView";

function DrawerChevronIcon({open}: {open: boolean}) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {open ? (
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
import styles from "./page.module.css";

type DashboardTab = {
  value: string;
  label: string;
  Icon: React.ComponentType;
  content: React.ReactNode;
};

const TABS: DashboardTab[] = [
  { value: "Well",       label: "Pozo",                   Icon: WellIcon,     content: <WellView /> },
  { value: "Production", label: "Empresas",               Icon: CompanyIcon,  content: <CompanyView /> },
  { value: "Analysis",   label: "Análisis de Producción", Icon: AnalysisIcon, content: <WellProductionComparisonView /> },
  { value: "Ranking",    label: "Ranking por empresa",    Icon: RankingIcon,  content: <CompanyRankingView /> },
];

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className={styles.pageShell}>
      <header className={styles.header}>
        <Image
          src="/logo-no-background.png"
          alt="PetroDash"
          className={styles.logo}
          width={180}
          height={54}
          priority
        />
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
                onClick={() => setIsDrawerOpen((v) => !v)}
                aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <DrawerChevronIcon open={isDrawerOpen} />
              </button>
            </div>

            <nav className={styles.drawerNav}>
              {TABS.map(({value, label, Icon}) => (
                <TabTrigger key={value} value={value} variant="drawer" onSelect={closeDrawer}>
                  <span className={styles.icon} aria-hidden title={label}><Icon /></span>
                  {isDrawerOpen && <span>{label}</span>}
                </TabTrigger>
              ))}
            </nav>
          </aside>

          <div className={`${styles.contentArea} ${isDrawerOpen ? styles.contentAreaExpanded : styles.contentAreaCollapsed}`}>
            {TABS.map(({value, content}) => (
              <TabContent key={value} value={value}>{content}</TabContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
