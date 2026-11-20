# Datacircle for Attio

See where a company ranks among the GTM API providers on [Datacircle](https://datacircle.dev), its API plans scored and priced, and who is best on each of its APIs, right on its company record in Attio.

Datacircle benchmarks the GTM APIs (company data, people data, email finding, verification and more) with real calls and ranks every plan on its results and price. This app reads those results from the open Datacircle API: no key, no account, nothing to connect.

## Install

1. In Attio, open **Settings → Apps**, search for **Datacircle** and click **Install**.
2. Approve the app's access: it reads your company records (their name and domains) to find each company on Datacircle. It writes nothing to your workspace.

That's all the setup: the app calls the Datacircle API without a key.

## The Datacircle rank widget

On a company record, open the ⋮ menu at the top right and choose **Configure page**. Under **Highlights**, click **Add widget**, choose **Datacircle rank** and **Save**. Highlights holds six widgets: if it's full, remove one first.

The widget then shows, on every company record:

- **#2 on Company headcount**: the company's best rank among the APIs Datacircle benchmarks, and how many of its APIs are on Datacircle;
- **Best**, when it ranks first on one of them;
- **No APIs on datacircle.dev**, when the company sells no API Datacircle lists.

Click the widget to open the same table as the action below.

## The Compare API plans action

On a company record, click **Compare API plans** in the record's actions (or press **Ctrl K** / **⌘ K** and type it). A dialog shows:

- each API the company sells, its rank on Datacircle and its best plan, with its price per 1,000 and its score;
- the five best plans on each of its top three APIs, the company itself highlighted, each plan linked to its page on datacircle.dev.

## How a company is found

The app matches a company record to a Datacircle provider by its name and its domains, and keeps a match only when the provider's website is one of the record's domains. A company Datacircle doesn't list shows "No APIs on datacircle.dev".

## The calls it makes

Every call is a `GET` to `https://api.datacircle.dev/v1`, open, with no key (its spec: https://api.datacircle.dev/v1/openapi.json), made from the app's server functions:

- `GET /providers/{slug}`: one provider, its APIs, its ranks and its plans;
- `GET /plans?query=...`: plans by provider name, when the company's slug doesn't match;
- `GET /apis/{slug}/best`: the best plans on one API.

Only the company's name and domains leave your workspace, as the slug and query of these calls.

## Support

Questions or a company we got wrong: open an issue here or write to the address on the app's listing. Datacircle: https://datacircle.dev. Terms: https://datacircle.dev/terms.

## Develop

Built with the [Attio App SDK](https://docs.attio.com/sdk/overview).

```bash
npm install
npm run dev     # attio dev: builds and installs the app in your workspace
npm run lint
```

`src/app/extensions/` holds the widget and the action, `src/datacircle/` the calls to the Datacircle API.
