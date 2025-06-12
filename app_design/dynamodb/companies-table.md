# Companies Table

This document outlines the schema for the `Companies` DynamoDB table.

## Primary Keys

- **PK**: `COMPANY#<CompanyId>`
- **SK**: `METADATA#<CompanyId>`
- **SK**: `ORG#<OrgId>#TEAM#<TeamId>`
- **SK**: `USER#<UserId>`

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

## User Profile Attributes (SK: `USER#<UserId>`)

User records are stored within the Companies table under the same `PK` as their company. The `UserId` is the Cognito `sub` value.

### Required Attributes

- `id` _(string)_ - User ID (Cognito sub)
- `name` _(string)_ - Full name
- `email` _(string)_ - Primary email address

### Optional Attributes

- `phone` _(string)_ - Contact phone number
- `address` _(string)_ - Physical address
- `teamId` _(string)_ - Team identifier (not all members need to belong to a team)
- `teamLead` _(boolean)_ - Indicates if user is a team lead (default: false)
- `uplineEVC` _(string)_ - Direct upline EVC name (required for WFG)
- `uplineSMD` _(string)_ - Direct upline SMD name (required for WFG)
- `bankInfoDocument` _(string)_ - DocuSign envelope ID for bank info form
- `taxDocument` _(string)_ - DocuSign envelope ID for tax form
- `createdAt` _(string)_ - ISO timestamp of creation
- `updatedAt` _(string)_ - ISO timestamp of last update

## Notes

- The Companies table stores business information for organizations collaborating with Miliare.
- All timestamps should be in ISO 8601 format.
- Compensation percentages should be stored as decimal values (e.g., 0.15 for 15%).
- The table supports querying companies by status and compensation structure.
