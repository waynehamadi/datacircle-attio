import {Extensions, showDialog} from "attio/client"
import {CompareDialog} from "../../../components/compare-dialog"

/** On a company that sells GTM APIs: its plans on each API, ranked as on datacircle.dev, and who is best on each. */
export default Extensions.defineExtension({
    id: "compare-api-plans",
    type: "record-action",
    label: "Compare API plans",
    icon: "Table",
    onTrigger: async ({recordId}) => {
        await showDialog({
            title: "Compare API plans",
            Dialog: () => <CompareDialog recordId={recordId} />,
        })
    },
    objects: "companies",
})
