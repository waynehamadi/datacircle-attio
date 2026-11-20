# Datacircle for Attio

See where a company ranks among the GTM API providers on https://datacircle.dev, its API plans scored and priced, and who is best on each of its APIs.

- **Datacircle rank**, a widget on company records: the company's best rank on datacircle.dev.
- **Compare API plans**, an action on company records: each API it sells, its rank and its best plan, and the five best plans on its top APIs.

It calls the Datacircle API (https://api.datacircle.dev/v1, no key) from server functions: `GET /providers/{slug}`, `GET /plans`, `GET /apis/{slug}/best`.

```bash
npm install
npm run dev     # attio dev, pushes to a workspace
npm run lint
```
