import React from "react";

type MessageVariant = "info" | "warning" | "error";

interface InlineMessageProps {
    message: string;
    variant?: MessageVariant;
}

export function InlineMessage({message, variant = "info"}: InlineMessageProps) {
    return <div style={messageStyle(variant)}>{message}</div>;
}

function messageStyle(variant: MessageVariant): React.CSSProperties {
    const base: React.CSSProperties = {
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 13,
        lineHeight: 1.4,
        border: "1px solid",
    };

    if (variant === "error") {
        return {
            ...base,
            color: "var(--color-error)",
            background: "var(--color-error-bg)",
            borderColor: "var(--color-error)",
        };
    }

    if (variant === "warning") {
        return {
            ...base,
            color: "var(--color-warning)",
            background: "var(--color-warning-bg)",
            borderColor: "var(--color-warning)",
        };
    }

    return {
        ...base,
        color: "var(--color-text-secondary)",
        background: "var(--color-bg-surface)",
        borderColor: "var(--color-border-subtle)",
    };
}
