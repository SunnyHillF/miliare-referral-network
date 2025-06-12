import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { backend } from './backend';

const stack = backend.createStack('WebhookApi');

const api = new apigateway.RestApi(stack, 'WebhookRestApi', {
  defaultCorsPreflightOptions: {
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowMethods: apigateway.Cors.ALL_METHODS,
    allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
  },
});

const integration = new apigateway.LambdaIntegration(
  backend.updateReferralStatusWebhook.resources.lambda,
);

const referrals = api.root
  .addResource('webhook')
  .addResource('referrals')
  .addResource('{referralId}');

referrals.addMethod('POST', integration);

backend.addOutput({
  WEBHOOK_API_URL: api.url ?? '',
});
