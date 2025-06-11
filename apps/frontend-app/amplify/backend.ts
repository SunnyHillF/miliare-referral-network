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

const backend = defineBackend({
  auth,
  data,
  updateReferralStatusWebhook,
});

// Create a new API stack for the REST API
const apiStack = backend.createStack('webhook-api-stack');

// Create a new REST API
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

// API key validation will be handled internally by the function

// Create a new Lambda integration
const webhookLambdaIntegration = new LambdaIntegration(
  backend.updateReferralStatusWebhook.resources.lambda
);

// Create the webhook resource path: /webhook/referrals/{referralId}
const webhookPath = webhookRestApi.root.addResource('webhook');
const referralsPath = webhookPath.addResource('referrals');
const referralIdPath = referralsPath.addResource('{referralId}', {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.NONE,
  },
});

// Add POST method for the webhook
referralIdPath.addMethod('POST', webhookLambdaIntegration);

// Grant the function access to the data models
backend.updateReferralStatusWebhook.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['appsync:GraphQL'],
    resources: [
      `${backend.data.resources.graphqlApi.arn}/types/Partner/fields/*`,
      `${backend.data.resources.graphqlApi.arn}/types/Referral/fields/*`,
    ],
  })
);

// Add outputs to the configuration file
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
