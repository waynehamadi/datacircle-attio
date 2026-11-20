import {
    Badge,
    Divider,
    EmptyState,
    Link,
    LoadingState,
    Section,
    Table,
    Typography,
    useAsyncCache,
} from "attio/client"
import {Suspense} from "react"
import getBestPlans from "../datacircle/get-best-plans.server"
import type {Provider} from "../datacircle/types"
import {price, rank, score} from "./format"
import {useProvider} from "./use-provider"

/** How many of the provider's APIs get their best plans shown, best ranked first. */
const COMPARED = 3

function BestOnEach({provider}: {provider: Provider}) {
    const slugs = provider.apis.slice(0, COMPARED).map((api) => api.slug)
    const {
        values: {best},
    } = useAsyncCache({best: [getBestPlans, slugs, 5]})
    if (best.error) {
        return <Typography.Body>{best.error}</Typography.Body>
    }
    return (
        <>
            {best.lists.map((list) => (
                <Section
                    key={list.slug}
                    title={`Best for ${list.api}`}
                    description={`The five best of ${list.total.toLocaleString("en-US")} plans`}
                >
                    <Table label={`Best for ${list.api}`}>
                        <Table.Header>
                            <Table.HeaderCell>Rank</Table.HeaderCell>
                            <Table.HeaderCell>Provider</Table.HeaderCell>
                            <Table.HeaderCell>Plan</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Score</Table.HeaderCell>
                        </Table.Header>
                        <Table.Body>
                            {list.plans.map((plan) => (
                                <Table.Row
                                    key={`${plan.rank}-${plan.provider}-${plan.plan}-${plan.page}`}
                                >
                                    <Table.Cell>{rank(plan.rank)}</Table.Cell>
                                    <Table.Cell>
                                        {plan.provider === provider.provider ? (
                                            <Badge color="green">{plan.provider}</Badge>
                                        ) : (
                                            plan.provider
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {plan.page ? (
                                            <Link href={plan.page}>{plan.plan ?? "Plan"}</Link>
                                        ) : (
                                            (plan.plan ?? "–")
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{price(plan.perThousand)}</Table.Cell>
                                    <Table.Cell>{score(plan.score)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {list.bestPage ? (
                        <Link href={list.bestPage}>{`See every plan for ${list.api}`}</Link>
                    ) : null}
                </Section>
            ))}
        </>
    )
}

function ApiName({name, page}: {name: string; page: string | null}) {
    return page ? <Link href={page}>{name}</Link> : <>{name}</>
}

function ProviderPlans({recordId}: {recordId: string}) {
    const {name, provider, error} = useProvider(recordId)
    if (error) {
        return <EmptyState title="Datacircle can't be read now" description={error} />
    }
    if (!provider) {
        return (
            <EmptyState
                title={`${name ?? "This company"} has no APIs on datacircle.dev`}
                description="Datacircle ranks the GTM API providers. Check the company's name and domains on this record."
            />
        )
    }
    return (
        <>
            <Section
                title={`${provider.provider} on datacircle.dev`}
                description={`Its plans on ${provider.apis.length} ${provider.apis.length === 1 ? "API" : "APIs"}, best rank first`}
            >
                <Table label={`${provider.provider}'s APIs`}>
                    <Table.Header>
                        <Table.HeaderCell>API</Table.HeaderCell>
                        <Table.HeaderCell>Rank</Table.HeaderCell>
                        <Table.HeaderCell>Its best plan</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Score</Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>
                        {provider.apis.map((api) => (
                            <Table.Row key={api.slug}>
                                <Table.Cell>
                                    <ApiName name={api.api} page={api.bestPage ?? api.sheetPage} />
                                </Table.Cell>
                                <Table.Cell>{rank(api.rank)}</Table.Cell>
                                <Table.Cell>{api.plan?.plan ?? "–"}</Table.Cell>
                                <Table.Cell>{price(api.plan?.perThousand ?? null)}</Table.Cell>
                                <Table.Cell>{score(api.plan?.score ?? null)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Section>
            <Divider />
            <Suspense fallback={<LoadingState />}>
                <BestOnEach provider={provider} />
            </Suspense>
            <Divider />
            <Typography.Body>
                Prices and scores from <Link href="https://datacircle.dev">datacircle.dev</Link>
            </Typography.Body>
        </>
    )
}

export function CompareDialog({recordId}: {recordId: string}) {
    return (
        <Suspense fallback={<LoadingState />}>
            <ProviderPlans recordId={recordId} />
        </Suspense>
    )
}
