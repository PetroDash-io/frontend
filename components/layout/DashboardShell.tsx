"use client";

import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {WellIcon} from "@/components/wells/WellView";
import {CompanyIcon} from "@/components/company/CompanyView";
import {AnalysisIcon} from "@/components/wells/WellProductionComparisonView";
import {RankingIcon} from "@/components/company/CompanyRankingView";
import styles from "@/app/page.module.css";

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

const NAV_ITEMS = [
  {href: "/pozos", label: "Pozos", Icon: WellIcon},
  {href: "/empresas", label: "Empresas", Icon: CompanyIcon},
  {href: "/analisis-pozo", label: "Análisis de Pozo", Icon: AnalysisIcon},
  {href: "/ranking-empresas", label: "Ranking Empresas", Icon: RankingIcon},
] as const;

export function DashboardShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
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
            {NAV_ITEMS.map(({href, label, Icon}) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeDrawer}
                  className="tab-btn"
                  style={tabDrawerStyle(isActive)}
                >
                  <span className={styles.icon} aria-hidden title={label}><Icon /></span>
                  {isDrawerOpen && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className={`${styles.contentArea} ${isDrawerOpen ? styles.contentAreaExpanded : styles.contentAreaCollapsed}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

function tabDrawerStyle(active: boolean): React.CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${active ? "var(--color-border-medium)" : "transparent"}`,
    backgroundColor: active ? "var(--color-bg-sunken)" : "transparent",
    color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  };
}
