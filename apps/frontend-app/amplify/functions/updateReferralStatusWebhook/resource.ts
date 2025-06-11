import { defineFunction } from '@aws-amplify/backend';

export const updateReferralStatusWebhook = defineFunction({
  entry: './handler.ts',
  timeoutSeconds: 10,
});
