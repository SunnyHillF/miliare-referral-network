import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
  DomainName,
  BasePathMapping,
} from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
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

// Simplified domain configuration using environment variables
const DOMAIN_CONFIG = {
  baseDomain: 'miliarereferral.com',
  hostedZoneId: 'Z06213242VS6L891DGP31',
  getCustomDomain: () => {
    const subdomain = process.env.BRANCH === 'prod' ? 'api' : process.env.BRANCH === 'main' ? 'api-stage' : `api-${process.env.BRANCH}`;
    return `${subdomain}.miliarereferral.com`;
  },
};

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

// Create webhook API with simplified configuration
const createWebhookApi = () => {
  const apiStack = backend.createStack('webhook-api-stack');
  
  // Use environment variables for branch configuration
  const branch = process.env.AWS_BRANCH || 'main';
  const customDomain = DOMAIN_CONFIG.getCustomDomain();
  
  // Create API
  const api = new RestApi(apiStack, 'WebhookRestApi', {
    restApiName: API_CONFIG.name,
    deploy: true,
    deployOptions: { stageName: API_CONFIG.stage },
    defaultCorsPreflightOptions: CORS_CONFIG,
  });

  // Always create custom domain
  const hostedZone = HostedZone.fromHostedZoneAttributes(apiStack, 'HostedZone', {
    hostedZoneId: DOMAIN_CONFIG.hostedZoneId,
    zoneName: DOMAIN_CONFIG.baseDomain,
  });

  const certificate = new Certificate(apiStack, 'ApiCertificate', {
    domainName: customDomain,
    validation: CertificateValidation.fromDns(hostedZone),
  });

  const customDomainResource = new DomainName(apiStack, 'ApiDomainName', {
    domainName: customDomain,
    certificate,
  });

  new BasePathMapping(apiStack, 'ApiBasePathMapping', {
    domainName: customDomainResource,
    restApi: api,
    stage: api.deploymentStage,
  });

  return { 
    api, 
    stack: apiStack, 
    customDomain,
    branch
  };
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

// Add comprehensive outputs for both environments
const addApiOutputs = (api: RestApi, customDomain: string, branch: string) => {
  const baseUrl = `https://${customDomain}`;
  const webhookEndpoint = `${baseUrl}/webhook/referrals/{referralId}`;
  const subdomain = customDomain.split('.')[0]; // Extract subdomain from full domain
  
  backend.addOutput({
    custom: {
      API: {
        [api.restApiName]: {
          endpoint: baseUrl,
          webhookEndpoint,
          region: Stack.of(api).region,
          apiName: api.restApiName,
          customDomain,
          branch,
          enableCustomDomain: true,
          subdomain,
        },
      },
    },
  });
};

// Main setup
const { api, customDomain, branch } = createWebhookApi();
setupApiRoutes(api);
configureLambdaPermissions();
addApiOutputs(api, customDomain, branch);
