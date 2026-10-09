# Itinerary Planner demo

The public Itinerary Planner demo linked from aileverageautomation.com/planner-demo. It is a [Next.js](https://nextjs.org) app with no backend: all data is bundled with the app.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). There is no sign-in and no environment variables to set; everyone uses the single demo host.

## How the data works

- `data/demo/*.json` holds the seed data, one JSON array per table, with the original IDs and relationships.
- `lib/demo-data.ts` exposes typed query functions over that data, returning the same nested shapes the components use (for example, a tour with its host and members).
- `lib/demo-store.ts` is the in-browser store. Edits made in the demo (new tours, roster changes, agenda edits, post-trip notes, feedback) are saved to `sessionStorage`, so they survive navigation within a visit and reset when the tab closes. The "Reset demo" control clears them immediately. Nothing is shared between visitors.

To change the seed data, edit the JSON files in `data/demo/`.

`docs/` keeps the SQL schema and seed from the database the demo used to run on, for reference only.

## Deploy

Deployed on Vercel as the `itinerary-planner-demo` project. Pull requests get a preview deployment; merging to `main` deploys production.
