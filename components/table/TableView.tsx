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

};


export function TableView({filters}: TableViewProps) {

    const {data: wells, loading, error} = useWells({filters});
    const errorMessage = error || null;

    useEffect(() => {
        if (!errorMessage) return;
        toast.error(errorMessage || "Unexpected error", {toastId: errorMessage || "Unexpected error"});
    }, [errorMessage]);

    return (
        <>
            <WellsTable data={wells || []}/>

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

const styles = {
    filterPanel: {
        display: "flex",
        gap: 12,
        padding: "12px 24px",
    } as React.CSSProperties,
    errorMessageContainer: {
        display: "flex"
    } as React.CSSProperties,
    loadingContainer: {
        display: "flex"
    } as React.CSSProperties,
};
