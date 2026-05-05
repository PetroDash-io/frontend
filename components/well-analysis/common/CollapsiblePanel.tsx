import React from "react";
import {colors} from "@/utils/constants";

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  headerAction?: React.ReactNode;
}

export function CollapsiblePanel({title, children, isOpen, onToggle, headerAction}: CollapsiblePanelProps) {
  return (
    <div style={styles.panel}>
      <div style={styles.headerRow}>
        <span className="card-label">{title}</span>
        <div style={styles.headerRightArea}>
          {headerAction ? <span style={styles.headerAction}>{headerAction}</span> : null}
          <button type="button" style={styles.toggleButton} onClick={onToggle} aria-expanded={isOpen}>
            <span style={styles.chevron}>{isOpen ? "-" : "+"}</span>
          </button>
        </div>
      </div>

      {isOpen ? <div style={styles.content}>{children}</div> : null}
    </div>
  );
}

const styles = {
  panel: {
    backgroundColor: "var(--color-bg-surface)",
    borderRadius: "8px",
    border: `1px solid ${colors.panelBorder}`,
    boxShadow: "var(--shadow-sm)",
  } as React.CSSProperties,
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--color-border-subtle)",
  } as React.CSSProperties,
  headerRightArea: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,
  headerAction: {
    display: "inline-flex",
    alignItems: "center",
  } as React.CSSProperties,
  toggleButton: {
    border: "none",
    borderRadius: "6px",
    backgroundColor: "transparent",
    cursor: "pointer",
    width: "28px",
    height: "28px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  chevron: {
    color: "var(--color-text-secondary)",
    fontWeight: 700,
    fontSize: "18px",
    lineHeight: 1,
    minWidth: "18px",
    textAlign: "center",
  } as React.CSSProperties,
  content: {
    padding: "20px",
  } as React.CSSProperties,
};
