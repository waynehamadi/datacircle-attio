import {Extensions, showDialog, Widget} from "attio/client"
import {Suspense} from "react"
import {CompareDialog} from "../../../components/compare-dialog"
import {RankWidget} from "./rank-widget"

/** On a company record: its best rank among the GTM API providers on datacircle.dev. */
export default Extensions.defineExtension({
    id: "datacircle-rank",
    type: "record-widget",
    label: "Datacircle rank",
    Widget: ({recordId}) => (
        <Suspense fallback={<Widget.Loading />}>
            <RankWidget
                recordId={recordId}
                open={() =>
                    showDialog({
                        title: "Compare API plans",
                        Dialog: () => <CompareDialog recordId={recordId} />,
                    })
                }
            />
        </Suspense>
    ),
    objects: "companies",
})
