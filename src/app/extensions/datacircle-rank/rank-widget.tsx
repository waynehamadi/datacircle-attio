import {Badge, Widget} from "attio/client"
import {useProvider} from "../../../components/use-provider"

export function RankWidget({recordId, open}: {recordId: string; open: () => void}) {
    const {provider, error} = useProvider(recordId)
    const best = provider?.apis[0]
    return (
        <Widget.TextWidget onTrigger={provider ? open : undefined}>
            <Widget.Title>Datacircle rank</Widget.Title>
            {error ? (
                <Widget.Text.Primary>Not available now</Widget.Text.Primary>
            ) : !provider || !best ? (
                <Widget.Text.Primary>No APIs on datacircle.dev</Widget.Text.Primary>
            ) : best.rank === null ? (
                <>
                    <Widget.Text.Primary>
                        {provider.apis.length} {provider.apis.length === 1 ? "API" : "APIs"} on
                        datacircle.dev
                    </Widget.Text.Primary>
                    <Widget.Text.Secondary>Not ranked yet</Widget.Text.Secondary>
                </>
            ) : (
                <>
                    <Widget.Text.Primary>
                        #{best.rank} on {best.api}
                    </Widget.Text.Primary>
                    <Widget.Text.Secondary>
                        {provider.apis.length} {provider.apis.length === 1 ? "API" : "APIs"} on
                        datacircle.dev
                    </Widget.Text.Secondary>
                </>
            )}
            {best?.rank === 1 ? (
                <Widget.Decoration>
                    <Badge color="green">Best</Badge>
                </Widget.Decoration>
            ) : null}
        </Widget.TextWidget>
    )
}
