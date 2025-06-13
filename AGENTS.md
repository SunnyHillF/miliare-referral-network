# AGENTS Instructions

This repository contains the Miliare Referral Network monorepo.  The design specifications and early prototypes are located in the `app_design` folder.  New AI code agents should follow the guidelines below when working in this repo.

## Project Structure

- `app_design/proto-mrn` – Prototype React application which demonstrates the desired UI and component styling.  Use this as the primary visual reference when building the production app.
- `app_design/miliare-frontend` – *Deprecated* Next.js prototype.  It includes useful components and Tailwind examples that should be mirrored in the production app.  See the `design_docs/AGENTS.md` file in this folder for detailed Tailwind and lucide-react usage rules.
- `apps/frontend-app` – The active Amplify Gen&nbsp;2 frontend using React + Vite.  All MVP features should be implemented here.
- `infastructure/` – CDK stacks for functionality that Amplify Gen&nbsp;2 cannot support.  Over time the Amplify backend will migrate into `infastructure/miliare-infa-core`.
- Preserve the Lucide icons exactly as used in `proto-mrn` to maintain the prototype look.

## Critical Icon Import Rule

To keep Amplify builds within memory limits **never use wildcard imports** from `lucide-react`.  Always import only the icons you need and create an icon map for dynamic usage.  The legacy AGENTS file shows the correct pattern:

```typescript
import { DollarSign, Clock, Users, TrendingUp } from 'lucide-react'

const iconMap: Record<string, any> = {
  DollarSign,
  Clock,
  Users,
  TrendingUp,
}
```
Import only the icons actually used in each component to keep the bundle lean.

Lines 12‑36 in `app_design/miliare-frontend/design_docs/AGENTS.md` explain why wildcard imports cause out-of-memory errors during Amplify builds and outline the required import approach.【F:app_design/miliare-frontend/design_docs/AGENTS.md†L12-L36】

## Future Work for Codex Agents

- Rebuild the prototype from `proto-mrn` inside `apps/frontend-app` while preserving the component structure found in `app_design/miliare-frontend`.
- Migrate Amplify data models and backend logic into CDK stacks under `infastructure/miliare-infa-core`.
- DocuSign automation is no longer required; remove any remaining placeholder code and references.
- Seed strategic partner data and replace temporary placeholder components with real models based on the design specifications.
- Continue to enforce specific icon imports to avoid memory issues.

