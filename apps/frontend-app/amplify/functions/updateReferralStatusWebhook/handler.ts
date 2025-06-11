import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import crypto from 'crypto';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend-function/runtime';
import { DataClient } from '@aws-amplify/data-client';
import { Schema } from '../../data/resource';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const apiKey = event.headers?.['x-api-key'];
  if (!apiKey) {
    return { statusCode: 401, body: 'Missing API key' };
  }

  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');

  const config = await getAmplifyDataClientConfig();
  const client = new DataClient<Schema>(config);

  // Find partner by apiKey hash
  const partners = await client.models.Partner.list({
    filter: { webhookApiKeyHash: { eq: hash } },
  });

  const partner = partners.data[0];
  if (!partner) {
    return { statusCode: 403, body: 'Invalid API key' };
  }

  const referralId = event.pathParameters?.referralId;
  if (!referralId) {
    return { statusCode: 400, body: 'Missing referral ID' };
  }

  const referral = await client.models.Referral.get({ id: referralId });
  if (!referral.data || referral.data.partnerId !== partner.id) {
    return { statusCode: 404, body: 'Referral not found' };
  }

  const body = JSON.parse(event.body || '{}');
  const status = body.status as Schema['Referral']['status'];

  const allowedStatus: Schema['Referral']['status'][] = [
    'IN_PROGRESS',
    'IN_REVIEW',
    'PAID',
    'REJECTED',
  ];
  if (!allowedStatus.includes(status)) {
    return { statusCode: 400, body: 'Invalid status' };
  }

  await client.models.Referral.update({ id: referralId, status });

  return { statusCode: 200, body: 'Updated' };
};
