import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { updateReferralStatusWebhook } from './functions/updateReferralStatusWebhook/resource';

export const backend = defineBackend({
  auth,
  data,
  updateReferralStatusWebhook,
});

// Create a new API stack for the webhook REST API
const apiStack = backend.createStack('webhook-api-stack');

// Define the REST API using API Gateway
const webhookRestApi = new RestApi(apiStack, 'WebhookRestApi', {
  restApiName: 'referralWebhookApi',
  deploy: true,
  deployOptions: {
    stageName: 'prod',
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
  },
});

// API key validation handled by the Lambda
const webhookLambdaIntegration = new LambdaIntegration(
  backend.updateReferralStatusWebhook.resources.lambda
);

// Create the /webhook/referrals/{referralId} path
const webhookPath = webhookRestApi.root.addResource('webhook');
const referralsPath = webhookPath.addResource('referrals');
const referralIdPath = referralsPath.addResource('{referralId}', {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.NONE,
  },
});

referralIdPath.addMethod('POST', webhookLambdaIntegration);

// Grant the function access to query Company and Referral models
backend.updateReferralStatusWebhook.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['appsync:GraphQL'],
    resources: [
      `${backend.data.resources.graphqlApi.arn}/types/Company/fields/*`,
      `${backend.data.resources.graphqlApi.arn}/types/Referral/fields/*`,
    ],
  })
);

// Output the API endpoint details for reference
backend.addOutput({
  custom: {
    API: {
      [webhookRestApi.restApiName]: {
        endpoint: webhookRestApi.url,
        region: Stack.of(webhookRestApi).region,
        apiName: webhookRestApi.restApiName,
      },
    },
  },
});
