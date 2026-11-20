import {get, hostOf, planRow, sameSite, slugOf} from "./client"
import type {Provider, ProviderApi} from "./types"

interface RawProvider {
    provider: string
    slug: string
    website?: string | null
    apis: {
        api: string
        slug: string
        rank?: number | null
        bestPage?: string | null
        sheetPage?: string | null
        plans?: Parameters<typeof planRow>[0][]
    }[]
}

/** The slugs to try for a company: its name's, then each domain's own label (apollo.io: apollo). */
function candidates(name: string, domains: string[]): string[] {
    const slugs = [slugOf(name), slugOf(name.replace(/\.(io|ai|com|co|dev|app|net|org)$/i, ""))]
    for (const domain of domains) {
        const labels = domain
            .replace(/^www\./, "")
            .toLowerCase()
            .split(".")
        if (labels.length >= 2) {
            slugs.push(slugOf(labels[labels.length - 2]))
        }
    }
    return [...new Set(slugs.filter(Boolean))]
}

function trim(raw: RawProvider): Provider {
    const apis: ProviderApi[] = raw.apis.map((api) => {
        const plans = (api.plans ?? []).map(planRow)
        const ranked = plans
            .filter((plan) => plan.rank !== null)
            .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
        return {
            api: api.api,
            slug: api.slug,
            rank: typeof api.rank === "number" ? api.rank : null,
            bestPage: api.bestPage ?? null,
            sheetPage: api.sheetPage ?? null,
            plan: ranked[0] ?? plans[0] ?? null,
        }
    })
    apis.sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.api.localeCompare(b.api))
    return {provider: raw.provider, slug: raw.slug, website: raw.website ?? null, apis}
}

async function find(name: string | null, domains: string[]): Promise<Provider | null> {
    const own = domains.map((domain) => domain.toLowerCase())
    for (const slug of candidates(name ?? "", own)) {
        const raw = (await get(`/providers/${encodeURIComponent(slug)}`)) as RawProvider | null
        if (raw && (own.length === 0 || sameSite(hostOf(raw.website), own))) {
            return trim(raw)
        }
    }
    if (!name || own.length === 0) {
        return null
    }
    const found = (await get(`/plans?${new URLSearchParams({query: name, limit: "50"})}`)) as {
        plans?: {provider: string; website?: string | null}[]
    } | null
    const match = found?.plans?.find((plan) => sameSite(hostOf(plan.website), own))
    if (!match) {
        return null
    }
    const raw = (await get(
        `/providers/${encodeURIComponent(slugOf(match.provider))}`
    )) as RawProvider | null
    return raw ? trim(raw) : null
}

/**
 * The provider on datacircle.dev that a company record is: found by its name or a domain's slug, and
 * kept only when its website is one of the record's domains (by name alone when the record has none).
 * Its provider null when it is no provider of ours, its error the words to show when Datacircle can't be read.
 */
export default async function findProvider(
    name: string | null,
    domains: string[]
): Promise<{provider: Provider | null; error: string | null}> {
    try {
        return {provider: await find(name, domains), error: null}
    } catch (error) {
        console.error(`[Datacircle] ${error instanceof Error ? error.message : String(error)}`)
        return {
            provider: null,
            error: error instanceof Error ? error.message : "Datacircle can't be read now.",
        }
    }
}
