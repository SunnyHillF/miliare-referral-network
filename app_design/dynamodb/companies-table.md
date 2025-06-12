# Companies Table

This document outlines the schema for the `Companies` DynamoDB table.

## Primary Keys

- **PK**: `COMPANY#<CompanyId>`
- **SK**: `METADATA#<CompanyId>`
- **SK**: `ORG#<OrgId>#TEAM#<TeamId>`

## Required Attributes

- `id` _(string)_ - Unique company identifier generated when the company is created
- `companyName` _(string)_ - Company name
- `contactEmail` _(string)_ - Email used for notifications
- `website` _(string)_ - Company's website URL
- `status` _(string)_ - Company status (ACTIVE, INACTIVE)
- `createdAt` _(string)_ - ISO timestamp of creation

## Optional Attributes

- `description` _(string)_ - Detailed description of the company's services
- `compensation` _(map)_ - Compensation structure:
  - `agentPercentage` _(number)_ - Percentage paid to referring agent
  - `teamLeadPercentage` _(number)_ - Percentage paid to the team lead
  - `orgLeadPercentage` _(number)_ - Percentage paid to the organization lead
  - `bonusPoolPercentage` _(number)_ - Percentage going to bonus pool
  - `mrnPercentage` _(number)_ - Percentage retained by MRN
  - `contractorPercentage` _(number)_ - Percentage paid to contractors
- `trainingLinks` _(list)_ - List of training resource URLs
- `updatedAt` _(string)_ - ISO timestamp of last update
- `orgLeadId` _(string)_ - Organization lead responsible for this company (stored on `ORG#<OrgId>#TEAM#<TeamId>` item)
- `teamLeadId` _(string)_ - Team lead responsible for this company (stored on `ORG#<OrgId>#TEAM#<TeamId>` item)

## Notes

- The Companies table stores business information for organizations collaborating with Miliare.
- All timestamps should be in ISO 8601 format.
- Compensation percentages should be stored as decimal values (e.g., 0.15 for 15%).
- The table supports querying companies by status and compensation structure.
