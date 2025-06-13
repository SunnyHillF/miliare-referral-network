# Seed Data Setup Guide

This guide will help you set up test data and user accounts for development.

> **Note**: This is a monorepo using pnpm. All commands assume you're running from the monorepo root unless otherwise specified.

## 🎯 Quick Start

### Step 1: Get Amplify Configuration

Before running the seed script, you need to get your Amplify configuration:

#### Option A: From Amplify Console (Recommended)
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. Go to "Backend environments" tab
4. Click on your environment (e.g., "main" or "staging")
5. Click "Download amplify_outputs.json"
6. Save the file as `amplify_outputs.json` in your `apps/frontend-app/` directory

**Important**: The file structure should look like this:
```
miliare-referral-network/
├── apps/
│   └── frontend-app/
│       ├── amplify_outputs.json  ← Place the file here
│       ├── package.json
│       ├── scripts/
│       └── amplify/
```

#### Option B: From Local Development
If you've been developing locally with `npx ampx sandbox`:
```bash
# From monorepo root - the file should already exist in your frontend-app directory
ls apps/frontend-app/amplify_outputs.json

# Or from the frontend-app directory
cd apps/frontend-app && ls amplify_outputs.json
```

### Step 2: Deploy and Run Seed Data

**Important**: Make sure you've deployed your latest schema changes that include API key permissions for seeding.

After your deployment is complete and you have the amplify_outputs.json file, run the seed data script:

```bash
# From the monorepo root directory
# Verify the amplify_outputs.json file exists
ls apps/frontend-app/amplify_outputs.json

# Ensure you have the 'ratediver' AWS profile configured
aws configure list-profiles | grep ratediver

# Run the seed data using pnpm (this creates companies, users in DynamoDB, and referrals)
# The script automatically uses the 'ratediver' AWS profile
pnpm --filter frontend-app seed

# Alternative: Navigate to the frontend-app directory first
cd apps/frontend-app
pnpm seed
```

### Step 3: Create Cognito Test Users

Since Cognito users must be created separately, you have two options:

#### Option A: Use AWS Console (Recommended)

1. Go to AWS Console → Cognito → User Pools
2. Find your user pool (should be named something like `amplify-*-userPool`)
3. Go to "Users" tab
4. Click "Create user" for each test account:

**Test Accounts to Create:**

| Email | Temporary Password | Role | Custom Attributes |
|-------|-------------------|------|-------------------|
| `admin@test.com` | `TempPass123!` | Admin | `custom:companyId` = (Sunny Hill Financial ID), `custom:activated` = `true` |
| `agent@test.com` | `TempPass123!` | Agent | `custom:companyId` = (Sunny Hill Financial ID), `custom:activated` = `true` |
| `teamlead@test.com` | `TempPass123!` | Team Lead | `custom:companyId` = (Sunny Hill Financial ID), `custom:activated` = `true` |
| `orglead@test.com` | `TempPass123!` | Org Lead | `custom:companyId` = (Sunny Hill Financial ID), `custom:activated` = `true` |

#### Option B: Use AWS CLI

```bash
# Replace YOUR_USER_POOL_ID with your actual user pool ID
# Get these values from the seed output or AWS Console
USER_POOL_ID="your-user-pool-id"
COMPANY_ID="your-sunny-hill-company-id"  # Get this from the pnpm seed output

# Create admin user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username "admin@test.com" \
  --user-attributes Name=email,Value="admin@test.com" Name=given_name,Value="John" Name=family_name,Value="Admin" Name=phone_number,Value="+1234567890" Name=address,Value="123 Admin Street, Admin City, AC 12345" Name="custom:companyId",Value="$COMPANY_ID" Name="custom:activated",Value="true" \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS

# Create agent user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username "agent@test.com" \
  --user-attributes Name=email,Value="agent@test.com" Name=given_name,Value="Jane" Name=family_name,Value="Agent" Name=phone_number,Value="+1234567891" Name=address,Value="456 Agent Avenue, Agent City, AC 12346" Name="custom:companyId",Value="$COMPANY_ID" Name="custom:activated",Value="true" \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS

# Create team lead user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username "teamlead@test.com" \
  --user-attributes Name=email,Value="teamlead@test.com" Name=given_name,Value="Mike" Name=family_name,Value="TeamLead" Name=phone_number,Value="+1234567892" Name=address,Value="789 Lead Lane, Lead City, LC 12347" Name="custom:companyId",Value="$COMPANY_ID" Name="custom:activated",Value="true" \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS

# Create org lead user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username "orglead@test.com" \
  --user-attributes Name=email,Value="orglead@test.com" Name=given_name,Value="Sarah" Name=family_name,Value="OrgLead" Name=phone_number,Value="+1234567893" Name=address,Value="321 Organization Blvd, Org City, OC 12348" Name="custom:companyId",Value="$COMPANY_ID" Name="custom:activated",Value="true" \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS
```

### Step 4: Assign User Groups (Important!)

After creating the Cognito users, assign them to the appropriate groups:

#### Using AWS Console:
1. Go to your User Pool → Groups
2. Create these groups if they don't exist:
   - `admin`
   - `companyAdmin` 
   - `teamLead`
   - `orgLead`
3. Go to Users tab, click on each user, and add them to groups:
   - `admin@test.com` → `admin` group
   - `agent@test.com` → (no groups needed)
   - `teamlead@test.com` → `teamLead` group
   - `orglead@test.com` → `orgLead` group

#### Using AWS CLI:
```bash
# Add users to groups
aws cognito-idp admin-add-user-to-group --user-pool-id $USER_POOL_ID --username "admin@test.com" --group-name "admin"
aws cognito-idp admin-add-user-to-group --user-pool-id $USER_POOL_ID --username "teamlead@test.com" --group-name "teamLead"
aws cognito-idp admin-add-user-to-group --user-pool-id $USER_POOL_ID --username "orglead@test.com" --group-name "orgLead"
```

## 🧪 Test Data Created

### Companies:
- **Sunny Hill Financial** - Financial planning, investment, and retirement services (Primary test company)
- **Prime Corporate Services** - Business services, tax preparation, bookkeeping, estate planning
- **ANCO Insurance** - Insurance solutions, employee benefits, business insurance
- **Weightless Financial** - Debt resolution, financial education, credit repair
- **Summit Retirement Plans** - 401k, retirement plans, employee benefits
- **Wellness for the Workforce** - Healthcare, wellness programs, employee benefits
- **Impact Health Sharing** - Health sharing and healthcare alternative solutions

### Users:
- **John Admin** (`admin@test.com`) - System administrator
- **Jane Agent** (`agent@test.com`) - Regular agent
- **Mike TeamLead** (`teamlead@test.com`) - Team leader
- **Sarah OrgLead** (`orglead@test.com`) - Organization leader

### Sample Referrals:
- **Robert Johnson** (Sunny Hill Financial) - IN_PROGRESS ($85,000) - Retirement planning
- **Emily Davis** (Prime Corporate Services) - IN_REVIEW ($45,000) - Business services
- **Michael Brown** (ANCO Insurance) - PAID ($125,000) - Employee benefits
- **Sarah Wilson** (Weightless Financial) - IN_PROGRESS ($15,000) - Debt consolidation
- **David Martinez** (Summit Retirement Plans) - PAID ($200,000) - 401k implementation
- **Jennifer Lee** (Impact Health Sharing) - IN_REVIEW ($35,000) - Health sharing plan

## 🔐 Login Credentials

All test accounts use the same temporary password: `TempPass123!`

Users will be prompted to change their password on first login.

## 🚀 Ready to Test!

After completing these steps, you can:

1. Visit your deployed application
2. Login with any of the test accounts
3. Explore different user roles and permissions
4. Test the referral system
5. Test company management features

## 🔧 Troubleshooting

### If amplify_outputs.json is missing:
- **From Console**: Go to Amplify Console → Your App → Backend environments → Download amplify_outputs.json
- **From CLI**: Run `npx ampx generate outputs --app-id YOUR_APP_ID --branch main` (from the frontend-app directory)
- **File Location**: Must be placed at `apps/frontend-app/amplify_outputs.json` (not in subdirectories)
- **File Format**: Should be a JSON file containing your backend configuration

### If seed data fails:
- Make sure your deployment completed successfully
- **Check that `amplify_outputs.json` exists in the correct location**:
  ```bash
  # From monorepo root
  ls apps/frontend-app/amplify_outputs.json
  
  # Or from frontend-app directory
  cd apps/frontend-app && ls amplify_outputs.json
  ```
- **Verify your AWS credentials are configured for the 'ratediver' profile**:
  ```bash
  aws configure list --profile ratediver
  aws sts get-caller-identity --profile ratediver
  ```
- Ensure you have the correct permissions to write to DynamoDB
- Check the console output for specific error messages
- **If you see "Failed to load amplify_outputs.json"**: The file is missing or in the wrong location
- **If you see authentication errors**: Your AWS credentials may be expired or the 'ratediver' profile is not configured
- **If you see "Profile ratediver not found"**: Configure the AWS profile with `aws configure --profile ratediver`
- **If you see "NoValidAuthTokens" or "No federated jwt"**: The schema needs to be deployed with API key permissions. Redeploy with `npx ampx deploy`

### If login fails:
- Verify the Cognito user was created with correct email
- Check that custom attributes are set correctly
- Ensure the user is in the right group
- Try resetting the password in AWS Console

### If permissions are wrong:
- Double-check user group assignments
- Verify the `custom:activated` attribute is set to `true`
- Check that `custom:companyId` matches a real company ID from the seed data 