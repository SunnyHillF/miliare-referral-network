import crypto from 'crypto';
import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import type { Schema } from '../../data/resource';

// Simple handler type definition to avoid aws-lambda dependency issues
type APIGatewayEvent = {
  headers?: { [key: string]: string | undefined };
  pathParameters?: { [key: string]: string | undefined };
  body?: string;
};

type APIGatewayResponse = {
  statusCode: number;
  body: string;
};

// Configure Amplify for server-side use
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT!,
      region: process.env.AWS_REGION!,
      defaultAuthMode: 'iam'
    }
  }
});

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayResponse> => {
  const apiKey = event.headers?.['x-api-key'];
  if (!apiKey) {
    return { statusCode: 401, body: 'Missing API key' };
  }

  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');

  // Generate client with IAM authentication
  const client = generateClient<Schema>({
    authMode: 'iam'
  });

  try {
  // Find company by apiKey hash
  const companies = await client.models.Company.list({
    filter: { webhookApiKeyHash: { eq: hash } },
  });

  const company = companies.data[0];
  if (!company) {
    return { statusCode: 403, body: 'Invalid API key' };
  }

    const referralId = event.pathParameters?.referralId;
    if (!referralId) {
      return { statusCode: 400, body: 'Missing referral ID' };
    }

  const referral = await client.models.Referral.get({ id: referralId });
  if (!referral.data || referral.data.companyId !== company.id) {
    return { statusCode: 404, body: 'Referral not found' };
  }

    const body = JSON.parse(event.body || '{}');
    const status = body.status as Schema['Referral']['type']['status'];

    const allowedStatus: Schema['Referral']['type']['status'][] = [
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
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
