import { defineFunction } from '@aws-amplify/backend';

export const updateReferralStatusWebhook = defineFunction({
  name: 'updateReferralStatusWebhook',
  entry: './handler.ts',
  runtime: 22,
  timeoutSeconds: 30,
  memoryMB: 512,
});
