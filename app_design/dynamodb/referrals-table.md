# Referrals Table

This document describes the schema for the `Referrals` DynamoDB table.

## Primary Keys

- **PK**: `REFERRAL#<ReferralId>`
- **SK**: `METADATA#<ReferralId>`

## Required Attributes

- `id` _(string)_ - Unique referral identifier
- `userId` _(string)_ - ID of the user who made the referral
- `companyId` _(string)_ - ID of the company receiving the referral
- `leadId` _(string)_ - Linked lead record
- `clientName` _(string)_ - Name of the referred client
- `status` _(string)_ - Referral status (IN_PROGRESS, IN_REVIEW, PAID, REJECTED)
- `amount` _(number)_ - Total commission amount in USD cents
- `createdAt` _(string)_ - ISO timestamp of creation

## Optional Attributes

- `uplineEVC` _(string)_ - ID of the upline EVC (required for WFG)
- `uplineSMD` _(string)_ - ID of the upline SMD (required for WFG)
- `compensation` _(map)_ - Commission distribution:
  - `agentAmount` _(number)_ - Amount for referring agent (15-25% based on company)
  - `teamLeadAmount` _(number)_ - Amount for team lead (2%)
  - `orgLeadAmount` _(number)_ - Amount for organization lead (1%)
  - `bonusPoolAmount` _(number)_ - Amount for bonus pool (2%)
  - `mrnAmount` _(number)_ - Amount retained by MRN (5%)
  - `contractorAmount` _(number)_ - Amount for contractors (if applicable)
- `companyType` _(string)_ - Type of company (DIRECT_PAYMENT, MRN_PAYMENT)
- `paymentStatus` _(string)_ - Payment status (PENDING, PROCESSED, FAILED)
- `notes` _(string)_ - Additional referral information
- `updatedAt` _(string)_ - ISO timestamp of last update
- `paidAt` _(string)_ - ISO timestamp when commission was paid

## Notes

- Each record associates a company with a lead referral and tracks the referral lifecycle.
- All timestamps should be in ISO 8601 format.
- Amounts are stored in cents to avoid floating-point precision issues.
- The table supports querying referrals by user, company, and status.
- Commission distribution varies by company:
  - Sunny Hill Financial: 25% total (15% agent, 2% team lead, 1% org lead, 2% bonus, 5% MRN)
  - Prime Corporate Services: 30% total (20% agent, 2% team lead, 1% org lead, 2% bonus, 5% MRN)
  - ANCO: 30% total (20% agent, 2% team lead, 1% org lead, 2% bonus, 2.5% contractor, 2.5% MRN)
  - Summit Business: 40% total (25% agent, 2% team lead, 1% org lead, 2% bonus, 5% contractor, 5% MRN)
- Some companies (Weightless Financial, Wellness for the Workforce) handle payments directly
- Upline fields are only required for WFG affiliates
