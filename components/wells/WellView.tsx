"use client";

import {useState, useMemo} from "react";
import {Tabs, TabTrigger, TabContent} from "@/components/common/Tabs";
import {MapView} from "@/components/map/MapView";
import {TableView} from "@/components/table/TableView";
import {LimitFilter} from "@/components/map/LimitFilter";
import {WellFilters} from "@/app/types/wellFilters";
import {SELECT_DEFAULT_VALUE, SelectFilter} from "@/components/common/SelectFilter";
import {useWells} from "@/hooks/useWells";


const DEFAULT_FILTERS = {
    province: SELECT_DEFAULT_VALUE,
    status: SELECT_DEFAULT_VALUE,
    company: SELECT_DEFAULT_VALUE,
    limit: 100,
}


export function WellView() {


    const [filters, setFilters] = useState<WellFilters>({
        province: "",
        status: "",
        company: "",
        limit: 100
    });
  
    const updateFilters = (filterName: string, value: unknown) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const {data: allWells} = useWells({filters: {...DEFAULT_FILTERS, limit: 10000}});

    const provinceFilterOptions = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.province))].filter(Boolean);
    }, [allWells]);

    const statusFilterOptions = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.status))].filter(Boolean);
    }, [allWells]);

    const companyFilterOptions = useMemo(() => {
        if (!allWells) return [];
        return [...new Set(allWells.map((well) => well.company))].filter(Boolean);
    }, [allWells]);

  
    return (
      <div>
  
        <div style={{display:"flex", gap:12, padding:"12px 24px"}}>
          <SelectFilter
            filterName="province"
            value={filters.province}
            onSelect={updateFilters}
            options={provinceFilterOptions}
            defaultOptionLabel="Todas las provincias"
          />
  
          <SelectFilter
            filterName="status"
            value={filters.status}
            onSelect={updateFilters}
            options={statusFilterOptions}
            defaultOptionLabel="Todos los estados"
          />
  
          <SelectFilter
            filterName="company"
            value={filters.company}
            onSelect={updateFilters}
            options={companyFilterOptions}
            defaultOptionLabel="Todas las empresas"
          />
  
          <LimitFilter
            filterName="limit"
            limit={filters.limit}
            onDefineLimit={updateFilters}
          />
        </div>
  
        <Tabs defaultValue="Map">
  
          <div style={{marginTop:"20px"}}>
            <TabTrigger value="Map">Mapa</TabTrigger>
            <TabTrigger value="Table">Tabla</TabTrigger>
          </div>
  
          <TabContent value="Map">
            <MapView filters={filters}/>
          </TabContent>
  
          <TabContent value="Table">
            <TableView filters={filters}/>
          </TabContent>
  
        </Tabs>
      </div>
    );
  }