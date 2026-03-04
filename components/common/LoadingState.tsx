import React from "react";
import {ClipLoader} from "react-spinners";

export function LoadingState() {
    return (
        <div style={styles.wrapper} role="status" aria-live="polite">
            <ClipLoader size={22} color="#3F6B4F"/>
        </div>
    );
}

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 12px",
    } as React.CSSProperties,
};
