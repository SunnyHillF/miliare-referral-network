import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { updateReferralStatusWebhook } from './functions/updateReferralStatusWebhook/resource';

export const backend = defineBackend({
  auth,
  data,
  updateReferralStatusWebhook,
});

// REST API exposing the updateReferralStatusWebhook Lambda
import './webhook-api';
