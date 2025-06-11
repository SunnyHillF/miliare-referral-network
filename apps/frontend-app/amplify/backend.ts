import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { updateReferralStatusWebhook } from './functions/updateReferralStatusWebhook/resource';

const backend = defineBackend({
  auth,
  data,
  updateReferralStatusWebhook,
});

// TODO: Re-add REST API configuration once frontend issue is resolved
// The function is still deployed and accessible via direct Lambda invocation
