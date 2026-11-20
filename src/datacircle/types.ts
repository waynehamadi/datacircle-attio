/** A plan as the app shows it: the few fields of the API's own plan it needs. */
export interface PlanRow {
    provider: string
    plan: string | null
    rank: number | null
    perThousand: number | null
    score: number | null
    page: string | null
}

/** One API a provider sells, its rank there and its best plan. */
export interface ProviderApi {
    api: string
    slug: string
    rank: number | null
    bestPage: string | null
    sheetPage: string | null
    plan: PlanRow | null
}

export interface Provider {
    provider: string
    slug: string
    website: string | null
    apis: ProviderApi[]
}

/** An API's best plans, best first. */
export interface BestPlans {
    api: string
    slug: string
    total: number
    bestPage: string | null
    plans: PlanRow[]
}
