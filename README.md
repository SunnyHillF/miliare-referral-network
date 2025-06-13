# Miliare Referral Network

This monorepo contains the source code for the Miliare Referral Network. The project is built with **AWS Amplify Gen 2** and a React + Vite frontend. Infrastructure that cannot be provisioned with Amplify lives under `infastructure/` as CDK stacks.

## Repository Layout

- `app_design/` – Early design specifications and prototype code used as a reference for the production app.
- `apps/frontend-app/` – Active React + Vite application configured with Amplify Gen 2.
- `infastructure/` – CDK stacks for additional AWS resources.
- `AGENTS.md` – Guidelines for AI coding agents working in this repository.

## Getting Started

Install dependencies with pnpm and start the frontend dev server:

```bash
pnpm install
pnpm run frontend:dev
```

The Amplify backend can be deployed with `pnpm amplify:push` from the repository root.

## License

This project is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file for details.
