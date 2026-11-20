/**
 * The Datacircle API: https://api.datacircle.dev/v1, open, with no key (its spec:
 * https://api.datacircle.dev/v1/openapi.json). Imported by server functions only.
 */
export const BASE = "https://api.datacircle.dev/v1"

/** The JSON of one GET, null on a 404, an error with its words on any other failure. */
export async function get(path: string): Promise<unknown> {
    const response = await fetch(`${BASE}${path}`, {headers: {Accept: "application/json"}})
    if (response.status === 404) {
        return null
    }
    if (response.status === 429) {
        throw new Error("Datacircle is busy. Try again in a minute.")
    }
    if (!response.ok) {
        throw new Error(`Datacircle answered ${response.status}. Try again later.`)
    }
    return response.json()
}

/** A name as a Datacircle slug: lowercase letters and digits, the rest a hyphen (Bright Data: bright-data). */
export function slugOf(name: string): string {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

/** A website's host, without www. */
export function hostOf(url: string | null | undefined): string | null {
    if (!url) {
        return null
    }
    try {
        return new URL(url.includes("://") ? url : `https://${url}`).hostname.replace(/^www\./, "")
    } catch {
        return null
    }
}

/** Whether a host is one of the record's domains, or under one of them, or the other way round. */
export function sameSite(host: string | null, domains: string[]): boolean {
    if (!host) {
        return false
    }
    return domains.some((domain) => {
        const own = domain.replace(/^www\./, "").toLowerCase()
        return host === own || host.endsWith(`.${own}`) || own.endsWith(`.${host}`)
    })
}

interface RawPlan {
    provider?: string
    plan?: string | null
    rank?: number | null
    perThousand?: number | null
    score?: number | null
    page?: string | null
}

export function planRow(plan: RawPlan): {
    provider: string
    plan: string | null
    rank: number | null
    perThousand: number | null
    score: number | null
    page: string | null
} {
    return {
        provider: plan.provider ?? "",
        plan: plan.plan ?? null,
        rank: typeof plan.rank === "number" ? plan.rank : null,
        perThousand: typeof plan.perThousand === "number" ? plan.perThousand : null,
        score: typeof plan.score === "number" ? plan.score : null,
        page: plan.page ?? null,
    }
}
