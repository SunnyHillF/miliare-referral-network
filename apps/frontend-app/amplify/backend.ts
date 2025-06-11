import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { updateReferralStatusWebhook } from './functions/updateReferralStatusWebhook/resource';

defineBackend({
  auth,
  data,
  updateReferralStatusWebhook,
  api: {
    updateReferralStatusWebhook: {
      path: '/webhook/referrals/{referralId}',
      method: 'POST',
      authorizationType: 'apiKey',
      function: updateReferralStatusWebhook,
    },
  },
});
