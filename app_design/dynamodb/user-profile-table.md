# User Profile Records

User profiles are stored inside the `Companies` table. Each user item shares the
same `PK` as its company and uses the Cognito `sub` value as the `SK`.

## Primary Keys
- **PK**: `COMPANY#<CompanyId>` - Company the user belongs to
- **SK**: `USER#<UserId>` - Cognito `sub` for the user

## Global Secondary Index (GSI): TeamMembership
- **PK**: `TEAM#<teamId>` - Team identifier
- **SK**: `USER#<UserId>` - User identifier  
- **Projected Attributes**: `teamLead`, `name`, `email`, `createdAt`

## Required Attributes
- `id` *(string)* - User ID (matches Cognito sub)
- `name` *(string)* - User's full name
- `email` *(string)* - Primary email address

## Optional Attributes
- `phone` *(string)* - Contact phone number
- `address` *(string)* - Physical address
- `company` *(string)* - Company affiliation (derived from the item `PK`)
- `teamId` *(string)* - Team identifier (optional - not all members need to belong to a team)
- `teamLead` *(boolean)* - Indicates if user is a team lead (default: false)
- `uplineEVC` *(string)* - Direct upline EVC name (required if company is WFG)
- `uplineSMD` *(string)* - Direct upline SMD name (required if company is WFG)
- `bankInfoDocument` *(string)* - DocuSign envelope ID for bank info form
- `taxDocument` *(string)* - DocuSign envelope ID for tax form
- `createdAt` *(string)* - ISO timestamp of creation
- `updatedAt` *(string)* - ISO timestamp of last update

## Notes
- The `UserId` used in the `SK` is the Cognito `sub`, ensuring alignment with authentication.
- All timestamps should be in ISO 8601 format.
- The `bankInfoDocument` and `taxDocument` fields store DocuSign envelope IDs for tracking document completion status.
- Company-specific fields (uplineEVC, uplineSMD) are only required for WFG affiliates.
- Team structure: Both team leads and regular members belong to teams via `teamId`. Team leads are identified by `teamLead: true`.
- The GSI enables efficient queries for all team members and easy identification of team leads within a team.
- This document replaces the old standalone `UserProfile` table; user items now live under their company in the `Companies` table.
