import { defineData, a } from "@aws-amplify/backend";
import type { ClientSchema } from "@aws-amplify/backend";
import { updateReferralStatusWebhook } from "../functions/updateReferralStatusWebhook/resource";

export const schema = a.schema({
  // Company model
  Company: a
    .model({
      id: a.id(),
      companyName: a.string().required(),
      contactEmail: a.string().required(),
      website: a.string().required(),
      status: a.string().required(),
      description: a.string(),
      compensation: a.customType({
        agentPercentage: a.float(),
        teamLeadPercentage: a.float(),
        divisionLeadPercentage: a.float(),
        bonusPoolPercentage: a.float(),
        mrnPercentage: a.float(),
        contracterPercentage: a.float(),
      }),
      trainingLinks: a.string().array(),
      divisionId: a.string(),
      webhookApiKeyHash: a.string(),
      createdAt: a.string().required(),
      updatedAt: a.string(),
      // Relationships
      users: a.hasMany("User", "companyId"),
      referrals: a.hasMany("Referral", "companyId"),
      trainingResources: a.hasMany("TrainingResource", "companyId"),
      faqItems: a.hasMany("FaqItem", "companyId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("admin").to(["create", "read", "update", "delete"]),
      allow.group("companyAdmin").to(["read", "update"]),
      allow.group("siteAdmin").to(["read", "update"]),
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
    ]),

  // User model (extends Cognito user)
  User: a
    .model({
      id: a.id(), // Maps to Cognito sub
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      address: a.string(),
      teamId: a.string(),
      teamLead: a.boolean(),
      teamLeadId: a.string(),
      divisionLeadId: a.string(),
      bankInfoDocument: a.string(),
      taxDocument: a.string(),
      // Company relationship
      companyId: a.id(),
      company: a.belongsTo("Company", "companyId"),
      // Referrals relationship
      referrals: a.hasMany("Referral", "userId"),
      createdAt: a.string().required(),
      updatedAt: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update"]),
      allow.authenticated().to(["read"]),
      allow.group("admin").to(["create", "read", "update", "delete"]),
      allow.group("teamLead").to(["read"]),
      allow.group("divisionLead").to(["update", "read"]),
      allow.group("companyAdmin").to(["read", "update"]),
      allow.group("siteAdmin").to(["read", "update"]),
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
    ]),

  // Referral model
  Referral: a
    .model({
      id: a.id(),
      companyId: a.string().required(),
      name: a.string().required(),
      email: a.string().required(),
      phoneNumber: a.string(),
      approximateValue: a.float(),
      userId: a.string().required(),
      status: a.enum(["IN_PROGRESS", "IN_REVIEW", "PAID", "REJECTED"]),
      notes: a.string(),
      // Payment information
      paymentId: a.string(),
      amount: a.float(),
      type: a.enum(["COMMISSION", "BONUS_POOL", "UPLINE"]),
      paymentType: a.enum(["COMMISSION", "BONUS_POOL", "UPLINE"]),
      paymentStatus: a.enum(["PENDING", "PROCESSED", "FAILED"]),
      period: a.string(), // YYYY-MM format
      processedAt: a.string(),
      bankInfo: a.customType({
        accountNumber: a.string(),
        routingNumber: a.string(),
        accountType: a.string(),
      }),
      // Split referral information
      splitUserIds: a.string().array(),
      // Relationships
      user: a.belongsTo("User", "userId"),
      company: a.belongsTo("Company", "companyId"),
      teamLeadId: a.string(),
      divisionLeadId: a.string(),
      createdAt: a.string().required(),
      updatedAt: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update"]),
      allow.authenticated().to(["create", "read", "update"]),
      allow.group("admin").to(["create", "read", "update", "delete"]),
      allow.group("teamLead").to(["update", "read"]),
      allow.group("divisionLead").to(["update", "read"]),
      allow.group("companyAdmin").to(["read", "update"]),
      allow.group("siteAdmin").to(["read", "update"]),
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
    ]),

  // Training resource model
  TrainingResource: a
    .model({
      id: a.id(),
      companyId: a.string().required(),
      title: a.string().required(),
      type: a.enum(["video", "document"]),
      url: a.string().required(),
      duration: a.string(),
      company: a.belongsTo("Company", "companyId"),
      createdAt: a.string().required(),
      updatedAt: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("admin").to(["create", "read", "update", "delete"]),
      allow.group("companyAdmin").to(["create", "read", "update", "delete"]),
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
    ]),

  // FAQ model
  FaqItem: a
    .model({
      id: a.id(),
      companyId: a.string().required(),
      question: a.string().required(),
      answer: a.string().required(),
      company: a.belongsTo("Company", "companyId"),
      createdAt: a.string().required(),
      updatedAt: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("admin").to(["create", "read", "update", "delete"]),
      allow.group("companyAdmin").to(["create", "read", "update", "delete"]),
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

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
    updateReferralStatusWebhook,
  },
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
