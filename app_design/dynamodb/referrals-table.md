# Referrals Table

This document describes the unified `Referrals` DynamoDB table. Payment records previously stored in `Payments` are now captured here.

## Keys

- **PK**: `COMPANY#<CompanyId>#REFERRAL#<ReferralId>`
- **SK**: varies per item type

Multiple items share the same partition key to store metadata, status, and payment details for a single referral.

### Sort Keys
- `METADATA#<ReferralId>` – Customer and user information
- `STATUS#<ReferralId>` – Current referral status
- `PAYMENT#<ReferralId>` – Payment data

## METADATA Item Attributes

- `id` _(string)_ - Generated referral identifier
- `companyId` _(string)_ - ID of the company receiving the referral
- `name` _(string)_ - Referred customer name
- `email` _(string)_ - Referred customer email
- `phoneNumber` _(string)_ - Customer phone number
- `approximateValue` _(number)_ - Estimated value of the referral
- `userId` _(string)_ - User who submitted the referral
- `teamLeadId` _(string)_ - Team lead for the submitting user
- `divisionLeadId` _(string)_ - Division lead for the submitting user
- `splitUserIds` _(list)_ - Additional users to split the referral with
- `createdAt` _(string)_ - ISO timestamp of creation

## STATUS Item Attributes

- `status` _(string)_ - Referral status (IN_PROGRESS, IN_REVIEW, PAID, REJECTED)
- `updatedAt` _(string)_ - ISO timestamp of last status change
- `notes` _(string)_ - Additional notes

## PAYMENT Item Attributes

- `paymentId` _(string)_ - Unique payment identifier
- `amount` _(number)_ - Payment amount in USD cents
- `type` _(string)_ - Payment type (COMMISSION, BONUS_POOL, UPLINE)
- `paymentStatus` _(string)_ - Payment status (PENDING, PROCESSED, FAILED)
- `period` _(string)_ - Payment period (YYYY-MM)
- `processedAt` _(string)_ - ISO timestamp when payment was processed
- `bankInfo` _(map)_ - Bank account information:
  - `accountNumber` _(string)_ - Last 4 digits of account
  - `routingNumber` _(string)_ - Last 4 digits of routing
  - `accountType` _(string)_ - Type of bank account
- `updatedAt` _(string)_ - ISO timestamp of last update

## Notes

- A unique `ReferralId` is generated for each referral.
- All timestamps use ISO 8601 format.
- Amounts are stored in cents to avoid floating-point precision issues.
- Consolidating payment data into this table simplifies querying by company or user.
