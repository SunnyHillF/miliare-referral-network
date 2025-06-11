# Referral Webhook Function

This AWS Lambda function handles incoming referral webhook events in the Miliare Referral Network.

## Purpose

The `referral-webhook` function processes incoming webhook requests related to referral events. It provides a secure endpoint for external systems to notify the application about referral activities.

## Features

- Handles incoming webhook POST requests
- Logs referral data for debugging and monitoring
- Provides proper CORS headers for web client access
- Returns appropriate HTTP status codes and error handling
- Structured JSON responses

## Usage

This function is automatically deployed as part of the Amplify Gen 2 backend. The webhook endpoint will be available at:

```
https://your-api-gateway-url/referral-webhook
```

## Customization

To customize the referral processing logic, modify the handler.ts file to:

1. Add referral data validation
2. Store referral information in the database
3. Send notifications to relevant parties
4. Update referral tracking metrics
5. Integrate with external referral tracking systems

## Response Format

### Success Response (200)
```json
{
  "message": "Referral webhook processed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response (500)
```json
{
  "error": "Internal server error",
  "message": "Failed to process referral webhook"
}
``` 