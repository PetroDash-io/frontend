"use client";

import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {tabDrawerStyle} from "@/components/common/Tabs";
import {WellIcon} from "@/components/wells/WellsView";
import {CompanyIcon} from "@/components/company/CompanyView";
import {AnalysisIcon} from "@/components/well-analysis/WellAnalysisView";
import {RankingIcon} from "@/components/companies-ranking/CompanyRankingView";
import styles from "@/app/page.module.css";
import {NAV_ROUTE_KEYS, type NavRouteKey, ROUTES} from "@/config/routes";

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

type NavItemMeta = {
  label: string;
  Icon: React.ComponentType;
};

const NAV_META: Record<NavRouteKey, NavItemMeta> = {
  wells: {label: "Pozos", Icon: WellIcon},
  companies: {label: "Empresas", Icon: CompanyIcon},
  wellAnalysis: {label: "Análisis de Pozo", Icon: AnalysisIcon},
  companiesRanking: {label: "Ranking Empresas", Icon: RankingIcon},
};

const NAV_ITEMS = NAV_ROUTE_KEYS.map((key) => ({
  href: ROUTES[key].public,
  label: NAV_META[key].label,
  Icon: NAV_META[key].Icon,
}));

export function DashboardShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((v) => !v);

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
        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleDrawer}
          aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
          aria-controls="dashboard-navigation"
          aria-expanded={isDrawerOpen}
        >
          {isDrawerOpen ? "✕" : "☰"}
        </button>
      </header>

      <div className={`${styles.dashboardLayout} ${isDrawerOpen ? styles.dashboardLayoutExpanded : styles.dashboardLayoutCollapsed}`}>
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
              onClick={toggleDrawer}
              aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
              aria-controls="dashboard-navigation"
              aria-expanded={isDrawerOpen}
            >
              <DrawerChevronIcon open={isDrawerOpen} />
            </button>
          </div>

          <nav className={styles.drawerNav}>
            {NAV_ITEMS.map(({href, label, Icon}) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeDrawer}
                  className={styles["tab-btn"]}
                  style={{...tabDrawerStyle(isActive), textDecoration: "none"}}
                >
                  <span className={styles.icon} aria-hidden title={label}><Icon /></span>
                  {isDrawerOpen && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className={styles.contentArea}>
          {children}
        </main>
      </div>

      <nav className={styles.bottomNav} aria-label="Navegación principal">
        {NAV_ITEMS.map(({href, label, Icon}) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.bottomNavLink} ${isActive ? styles.bottomNavLinkActive : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span aria-hidden="true"><Icon /></span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
