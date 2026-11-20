const DOLLARS = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
})
const CENTS = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
})

/** A plan's price for 1,000 items: "$4 per 1,000", "Free", or a dash when the sheet has none. */
export function price(perThousand: number | null): string {
    if (perThousand === null) {
        return "–"
    }
    if (perThousand === 0) {
        return "Free"
    }
    return `${(perThousand < 1 ? CENTS : DOLLARS).format(perThousand)} per 1,000`
}

export function score(value: number | null): string {
    return value === null ? "Not scored" : `${Math.round(value)}/100`
}

export function rank(value: number | null): string {
    return value === null ? "Not ranked" : `#${value}`
}
