import { createContext, useContext, useState, ReactNode  } from 'react';
import { colors } from '@/utils/constants';

interface TabContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
}

export const Tabs = ({ children, defaultValue }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-wrapper" style={styles.wrapper}>
        {children}
      </div>
    </TabContext.Provider>
  );
}

const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error('Tab components must be used within <Tabs />');
  return context;
};

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  variant?: 'button' | 'drawer';
  onSelect?: () => void;
}

export const TabTrigger = ({ value, children, variant = 'button', onSelect }: TabTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  const handleSelect = () => {
    setActiveTab(value);
    onSelect?.();
  };

  return (
    <button
      onClick={handleSelect}
      className={`tab-btn ${isActive ? 'active' : ''}`}
      style={variant === 'drawer' ? tabDrawerStyle(isActive) : tabButtonStyle(isActive)}
    >
      {children}
    </button>
  );
};

interface TabContentProps {
  value: string;
  children: ReactNode;
}

export const TabContent = ({ value, children }: TabContentProps) => {
  const { activeTab } = useTabs();

  // If this content doesn't match the active value, render nothing
  if (activeTab !== value) return null;

  return <div className="tab-main-content" style={styles.main}>{children}</div>;
};

const styles = {
    wrapper: {
        width: "100%",
    } as React.CSSProperties,
    main: {
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: colors.bg,
    } as React.CSSProperties,
} as const;

function tabButtonStyle(active: boolean): React.CSSProperties {
  return {
        padding: "8px 16px",
        borderRadius: 999,
        border: "none",
        backgroundColor: active ? "var(--color-brand-mid)" : "transparent",
        color: active ? "var(--color-text-inverse)" : "var(--color-brand-mid)",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: active ? "var(--shadow-sm)" : "none",
    };
}

export function tabDrawerStyle(active: boolean): React.CSSProperties {
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
    };
}
