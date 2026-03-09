"use client";

import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AppToastProvider() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop
            pauseOnFocusLoss={false}
            closeOnClick
            draggable
            theme="light"
        />
    );
}
