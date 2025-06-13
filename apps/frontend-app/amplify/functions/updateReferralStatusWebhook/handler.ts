import crypto from 'crypto';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource';

// Simple handler type definition to avoid aws-lambda dependency issues
type APIGatewayEvent = {
  httpMethod?: string;
  headers?: { [key: string]: string | undefined };
  pathParameters?: { [key: string]: string | undefined };
  body?: string;
  requestContext?: {
    httpMethod?: string;
  };
};

type APIGatewayResponse = {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
};

// Helper function to get header value case-insensitively
const getHeader = (headers: { [key: string]: string | undefined } | undefined, name: string): string | undefined => {
  if (!headers) return undefined;
  
  // Try exact match first
  if (headers[name]) return headers[name];
  
  // Try case-insensitive match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  return undefined;
};

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayResponse> => {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  const httpMethod = event.httpMethod || event.requestContext?.httpMethod;
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight' }),
    };
  }

  // Get API key from headers (case-insensitive)
  const apiKey = getHeader(event.headers, 'x-api-key');
  if (!apiKey || apiKey.trim() === '') {
    return { 
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing or empty API key' })
    };
  }

  // Validate API key format (basic validation)
  if (apiKey.length < 10) {
    return { 
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid API key format' })
    };
  }

  const hash = crypto.createHash('sha256').update(apiKey.trim()).digest('hex');

  // Generate client using the API key configured for this backend
  const client = generateClient<Schema>({
    authMode: 'apiKey',
  });

  try {
    // Parse request body first to get companyId
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { 
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }

    // Validate companyId is provided
    const companyId = body.companyId;
    if (!companyId || typeof companyId !== 'string') {
      return { 
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing or invalid companyId in request body' })
      };
    }

    // Get the specific company by ID and validate API key
    const company = await client.models.Company.get({ id: companyId });
    if (!company.data) {
      return { 
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Company not found' })
      };
    }

    // Validate API key hash matches this specific company
    if (company.data.webhookApiKeyHash !== hash) {
      return { 
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid API key for this company' })
      };
    }

    const referralId = event.pathParameters?.referralId;
    if (!referralId) {
      return { 
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing referral ID' })
      };
    }

    const referral = await client.models.Referral.get({ id: referralId });
    if (!referral.data || referral.data.companyId !== company.data.id) {
      return { 
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Referral not found' })
      };
    }

    const status = body.status as Schema['Referral']['type']['status'];

    const allowedStatus: Schema['Referral']['type']['status'][] = [
      'IN_PROGRESS',
      'IN_REVIEW',
      'PAID',
      'REJECTED',
    ];
    if (!allowedStatus.includes(status)) {
      return { 
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid status' })
      };
    }

    const updateInput: Partial<Schema['Referral']['type']> & { id: string } = {
      id: referralId,
      status,
    };

    if (status === 'PAID') {
      updateInput.paymentStatus = 'PENDING';
    }

    await client.models.Referral.update(updateInput);

    return { 
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Referral status updated successfully',
        referralId,
        newStatus: status,
        companyId: company.data.id
      })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { 
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
