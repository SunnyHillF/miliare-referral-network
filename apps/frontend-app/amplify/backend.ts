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

// Constants
const API_CONFIG = {
  name: 'referralWebhookApi',
  stage: 'prod',
  path: {
    webhook: 'webhook',
    referrals: 'referrals',
    referralId: '{referralId}',
  },
} as const;

const CORS_CONFIG = {
  allowOrigins: Cors.ALL_ORIGINS,
  allowMethods: ['POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
};

export const backend = defineBackend({
  auth,
  data,
  updateReferralStatusWebhook,
});

// Create webhook API
const createWebhookApi = () => {
  const apiStack = backend.createStack('webhook-api-stack');
  
  const api = new RestApi(apiStack, 'WebhookRestApi', {
    restApiName: API_CONFIG.name,
    deploy: true,
    deployOptions: { stageName: API_CONFIG.stage },
    defaultCorsPreflightOptions: CORS_CONFIG,
  });

  return { api, stack: apiStack };
};

// Setup API routes
const setupApiRoutes = (api: RestApi) => {
  const lambdaIntegration = new LambdaIntegration(
    backend.updateReferralStatusWebhook.resources.lambda
  );

  // Create nested resource path: /webhook/referrals/{referralId}
  const webhookResource = api.root
    .addResource(API_CONFIG.path.webhook)
    .addResource(API_CONFIG.path.referrals)
    .addResource(API_CONFIG.path.referralId, {
      defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE,
      },
    });

  webhookResource.addMethod('POST', lambdaIntegration);
  
  return api;
};

// Configure Lambda permissions
const configureLambdaPermissions = () => {
  const graphqlApiArn = backend.data.resources.graphqlApi.arn;
  
  backend.updateReferralStatusWebhook.resources.lambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['appsync:GraphQL'],
      resources: [
        `${graphqlApiArn}/types/Company/fields/*`,
        `${graphqlApiArn}/types/Referral/fields/*`,
      ],
    })
  );
};

// Add outputs
const addApiOutputs = (api: RestApi) => {
  backend.addOutput({
    custom: {
      API: {
        [api.restApiName]: {
          endpoint: api.url,
          region: Stack.of(api).region,
          apiName: api.restApiName,
        },
      },
    },
  });
};

// Main setup
const { api } = createWebhookApi();
setupApiRoutes(api);
configureLambdaPermissions();
addApiOutputs(api);
