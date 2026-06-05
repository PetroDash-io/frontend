export type ClassificationFilter = "all" | "conv" | "no_conv";

export type WellFilters = {
    watershed: string
    province: string
    status: string
    company: string
    limit: number
    classification: ClassificationFilter
  }