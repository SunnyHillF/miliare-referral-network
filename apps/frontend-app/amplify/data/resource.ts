import { defineData, a } from '@aws-amplify/backend';
import { updateReferralStatusWebhook } from "../functions/updateReferralStatusWebhook/resource";

const schema = a.schema({
  // Company model
  Company: a.model({
    id: a.id(),
    name: a.string().required(),
    contactEmail: a.string().required(),
    website: a.string().required(),
    status: a.string().required(),
    description: a.string(),
    compensation: a.map()
      .items({
        agentPercentage: a.float(),
        teamLeadPercentage: a.float(),
        orgLeadPercentage: a.float(),
        bonusPoolPercentage: a.float(),
        mrnPercentage: a.float(),
        contractorPercentage: a.float()
      }),
    trainingLinks: a.list().items(a.string()),
    orgId: a.string(),
    createdAt: a.string().required(),
    updatedAt: a.string(),
    // Relationships
    users: a.hasMany('User'),
    referrals: a.hasMany('Referral')
  }).authorization([
    a.allow.public().to(['read']),
    a.allow.group('admin').to(['create', 'read', 'update', 'delete']),
    a.allow.group('companyAdmin').to(['read', 'update'])
  ]),

  // User model (extends Cognito user)
  User: a.model({
    id: a.id(), // Maps to Cognito sub
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    address: a.string(),
    teamId: a.string(),
    teamLead: a.boolean(),
    teamLeadId: a.string(),
    orgLeadId: a.string(),
    bankInfoDocument: a.string(),
    taxDocument: a.string(),
    // Relationships
    company: a.belongsTo('Company'),
    referrals: a.hasMany('Referral'),
    createdAt: a.string().required(),
    updatedAt: a.string()
  }).authorization([
    a.allow.owner().to(['read']),
    a.allow.group('admin').to(['create', 'read', 'update', 'delete']),
    a.allow.group('teamLead').to(['read']),
    a.allow.group('orgLead').to(['update','read']),
    a.allow.group('companyAdmin').to(['create', 'read', 'update', 'delete']),
  ]),

  // Referral model
  Referral: a.model({
    id: a.id(),
    name: a.string().required(),
    email: a.string().required(),
    phoneNumber: a.string(),
    approximateValue: a.float(),
    status: a.enum(['IN_PROGRESS', 'IN_REVIEW', 'PAID', 'REJECTED']),
    notes: a.string(),
    // Payment information
    paymentId: a.string(),
    amount: a.float(),
    paymentType: a.enum(['COMMISSION', 'BONUS_POOL', 'UPLINE']),
    paymentStatus: a.enum(['PENDING', 'PROCESSED', 'FAILED']),
    period: a.string(), // YYYY-MM format
    processedAt: a.string(),
    bankInfo: a.map()
      .items({
        accountNumber: a.string(),
        routingNumber: a.string(),
        accountType: a.string()
      }),
    // Split referral information
    splitUserIds: a.list().items(a.string()),
    // Relationships
    user: a.belongsTo('User'),
    company: a.belongsTo('Company'),
    teamLeadId: a.string(),
    orgLeadId: a.string(),
    createdAt: a.string().required(),
    updatedAt: a.string()
  }).authorization([
    a.allow.owner().to(['create', 'read', 'update']),
    a.allow.group('admin').to(['create', 'read', 'update', 'delete']),
    a.allow.group('teamLead').to(['update','read']),
    a.allow.group('orgLead').to(['update','read'])
  ])
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used by the webhook to update referral status
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
  functions: {
    updateReferralStatusWebhook
  }
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
