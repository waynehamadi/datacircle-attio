import {get, planRow} from "./client"
import type {BestPlans} from "./types"

async function best(slugs: string[], limit: number): Promise<BestPlans[]> {
    const answers = await Promise.all(
        slugs.map(
            (slug) =>
                get(`/apis/${encodeURIComponent(slug)}/best?limit=${limit}`) as Promise<{
                    api: string
                    slug: string
                    total?: number
                    bestPage?: string | null
                    plans?: Parameters<typeof planRow>[0][]
                } | null>
        )
    )
    const lists: BestPlans[] = []
    for (const answer of answers) {
        if (answer) {
            lists.push({
                api: answer.api,
                slug: answer.slug,
                total: answer.total ?? 0,
                bestPage: answer.bestPage ?? null,
                plans: (answer.plans ?? []).map(planRow),
            })
        }
    }
    return lists
}

/**
 * Each API's best plans, best first, as its best page on datacircle.dev ranks them (five of each by default).
 * Its error the words to show when Datacircle can't be read.
 */
export default async function getBestPlans(
    slugs: string[],
    limit = 5
): Promise<{lists: BestPlans[]; error: string | null}> {
    try {
        return {lists: await best(slugs, limit), error: null}
    } catch (error) {
        console.error(`[Datacircle] ${error instanceof Error ? error.message : String(error)}`)
        return {
            lists: [],
            error: error instanceof Error ? error.message : "Datacircle can't be read now.",
        }
    }
}
