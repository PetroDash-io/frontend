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
            color: "#b91c1c",
            background: "#fee2e2",
            borderColor: "#fecaca",
        };
    }

    if (variant === "warning") {
        return {
            ...base,
            color: "#92400e",
            background: "#fef3c7",
            borderColor: "#fde68a",
        };
    }

    return {
        ...base,
        color: "#2f3e34",
        background: "#f7f3ec",
        borderColor: "#ddd2c2",
    };
}
