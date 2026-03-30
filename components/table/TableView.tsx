import React, {useEffect, useMemo, useState} from "react";
import {WellsTable} from "@/components/table/WellsTable";
import {useWells} from "@/hooks/useWells";
import {LimitFilter} from "@/components/map/LimitFilter";
import {SELECT_DEFAULT_VALUE, SelectFilter} from "@/components/common/SelectFilter";
import {LoadingState} from "@/components/common/LoadingState";
import {InlineMessage} from "@/components/common/InlineMessage";
import {toast} from "react-toastify";
// Ensure the correct path to the module
import { WellFilters } from "@/app/types/wellFilters";


const DEFAULT_FILTERS = {
    province: SELECT_DEFAULT_VALUE,
    status: SELECT_DEFAULT_VALUE,
    company: SELECT_DEFAULT_VALUE,
    limit: 100,
}



type TableViewProps = {
    filters: WellFilters;
    currentPage: number;
    onChangePage: (page: number) => void;
};


export function TableView({filters, currentPage, onChangePage}: TableViewProps) {
    const offset = currentPage * filters.limit;

    const {data: wells, loading, error, pagination} = useWells({filters, offset});
    const errorMessage = error || null;

    const totalItems = pagination?.total ?? 0;
    const pageSize = pagination?.limit ?? filters.limit;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPageNumber = currentPage + 1;
    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    const pageItems = buildPageItems(currentPageNumber, totalPages);

    useEffect(() => {
        if (!errorMessage) return;
        toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
    }, [errorMessage]);

    return (
        <>
            <WellsTable data={wells || []}/>

            <div style={styles.paginationContainer}>
                <button
                    type="button"
                    onClick={() => onChangePage(Math.max(currentPage - 1, 0))}
                    disabled={!canGoPrevious || loading}
                    style={styles.paginationButton(!canGoPrevious || loading)}
                >
                    Anterior
                </button>

                <div style={styles.pageNumbersContainer}>
                    {pageItems.map((item, index) => {
                        if (item === "...") {
                            return <span key={`ellipsis-${index}`} style={styles.ellipsis}>...</span>;
                        }

                        const isActive = item === currentPageNumber;
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onChangePage(item - 1)}
                                disabled={loading}
                                style={styles.pageNumberButton(isActive, loading)}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => onChangePage(Math.min(currentPage + 1, totalPages - 1))}
                    disabled={!canGoNext || loading}
                    style={styles.paginationButton(!canGoNext || loading)}
                >
                    Siguiente
                </button>
            </div>

            <div style={styles.paginationSummary}>
                Pagina {currentPageNumber} de {totalPages} - {totalItems} resultados
            </div>

            {errorMessage && (
                <div style={styles.errorMessageContainer}>
                    <InlineMessage message={errorMessage} variant="error"/>
                </div>
            )}

            {loading && (
                <div style={styles.loadingContainer}>
                    <LoadingState/>
                </div>
            )}
        </>
    )
}

function buildPageItems(currentPage: number, totalPages: number): Array<number | "..."> {
    if (totalPages <= 7) {
        return Array.from({length: totalPages}, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    const validPages = Array.from(pages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b);

    const pageItems: Array<number | "..."> = [];
    for (let index = 0; index < validPages.length; index += 1) {
        const page = validPages[index];
        const previousPage = validPages[index - 1];

        if (index > 0 && previousPage !== undefined && page - previousPage > 1) {
            pageItems.push("...");
        }

        pageItems.push(page);
    }

    return pageItems;
}

const styles = {
    paginationContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 14,
    } as React.CSSProperties,
    paginationButton: (disabled: boolean) => ({
        border: "1px solid #d3d3d3",
        borderRadius: 8,
        padding: "8px 12px",
        background: disabled ? "#f5f5f5" : "#ffffff",
        color: disabled ? "#9a9a9a" : "#2f3e34",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
    }) as React.CSSProperties,
    pageNumbersContainer: {
        display: "flex",
        alignItems: "center",
        gap: 6,
    } as React.CSSProperties,
    pageNumberButton: (active: boolean, disabled: boolean) => ({
        border: active ? "1px solid #3F6B4F" : "1px solid #d3d3d3",
        borderRadius: 8,
        width: 36,
        height: 36,
        background: active ? "#3F6B4F" : "#ffffff",
        color: active ? "#f3eee6" : "#2f3e34",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        fontWeight: 700,
    }) as React.CSSProperties,
    ellipsis: {
        color: "#6f6f6f",
        padding: "0 4px",
    } as React.CSSProperties,
    paginationSummary: {
        display: "flex",
        justifyContent: "center",
        marginTop: 8,
        color: "#3f3f3f",
        fontSize: 13,
    } as React.CSSProperties,
    errorMessageContainer: {
        display: "flex"
    } as React.CSSProperties,
    loadingContainer: {
        display: "flex"
    } as React.CSSProperties,
};
