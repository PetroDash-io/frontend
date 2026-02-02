import {ProductionMonthly} from "@/app/types";

export interface ProductionMonthlyResponse {
  source: string;
  well_id: number;
  data: ProductionMonthly[];
}