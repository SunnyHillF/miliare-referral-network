import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';
import { fetchAuthSession } from 'aws-amplify/auth';

export async function inviteCompanyAdmin({
  email,
  firstName,
  lastName,
  companyId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
}) {
  const region = import.meta.env.VITE_AWS_REGION;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;

  if (!region || !userPoolId) {
    throw new Error('Missing Cognito configuration');
  }

  const { credentials } = await fetchAuthSession();

  const client = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId: credentials!.accessKeyId,
      secretAccessKey: credentials!.secretAccessKey,
      sessionToken: credentials!.sessionToken,
    },
  });

  await client.send(
    new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'custom:companyId', Value: companyId },
      ],
    })
  );

  await client.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: 'companyAdmin',
    })
  );
}
