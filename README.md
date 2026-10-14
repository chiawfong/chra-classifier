# CHRA Classifier

Chemical hazard classification web app for mixtures, based on Malaysia's
**ICOP on Classification, Labelling and Safety Data Sheet of Hazardous Chemicals** (GHS-aligned).

**Live site:** https://chra-classifier.vercel.app/

## What it does

- Search a chemical (local DB + PubChem) and see its GHS classification.
- Build a **mixture** (ingredients + concentrations) and classify the whole blend.
- Shows the **proof** behind every result — formula, steps, and the ICOP table/section used.
- Export the assessment to PDF.

## Classification engine

`src/lib/classification/`

| Module | Handles | Core method |
|--------|---------|-------------|
| `acute-toxicity.ts` | Acute Tox. (oral/dermal/inhalation) | ATEmix additivity formula |
| `concentration-limits.ts` | Health hazards (Skin/Eye, CMR, STOT, Sens., Asp.) | Concentration cut-off limits |
| `physical-hazards.ts` | Flammability, oxidiser, etc. | Test data / ingredient rules |
| `environmental-hazards.ts` | Aquatic toxicity | Summation + additivity |
| `index.ts` | Orchestrates all of the above | — |

## Dev

```bash
npm run dev     # http://localhost:3000
npm run build
```

Auth (Google sign-in via NextAuth) is wired up but **disabled** for the testing
phase — see `src/lib/auth.ts`. Re-enable by setting the Google OAuth env vars
when going live.

## Deploy

Auto-deploys to Vercel from the connected GitHub repo.
