import {useAsyncCache, useQuery} from "attio/client"
import findProvider from "../datacircle/find-provider.server"
import getCompany from "../graphql/get-company.graphql"

/** The company record's provider on datacircle.dev, read once and cached (may suspend). */
export function useProvider(recordId: string) {
    const {company} = useQuery(getCompany, {recordId})
    const name = company?.name ?? null
    const domains = [...(company?.domains ?? [])]
    const {
        values: {found},
    } = useAsyncCache({found: [findProvider, name, domains]})
    return {name, ...found}
}
