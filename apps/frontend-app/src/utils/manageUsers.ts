import { CognitoIdentityProviderClient, ListUsersCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { fetchAuthSession } from 'aws-amplify/auth';

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  activated: boolean;
}

function getClient() {
  const region = import.meta.env.VITE_AWS_REGION;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  if (!region || !userPoolId) {
    throw new Error('Missing Cognito configuration');
  }
  return { region, userPoolId };
}

export async function listCompanyUsers(companyId: string): Promise<CompanyUser[]> {
  const { region, userPoolId } = getClient();
  const { credentials } = await fetchAuthSession();
  const client = new CognitoIdentityProviderClient({
    region,
    credentials: {
      accessKeyId: credentials!.accessKeyId,
      secretAccessKey: credentials!.secretAccessKey,
      sessionToken: credentials!.sessionToken,
    },
  });

  const resp = await client.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `custom:companyId = "${companyId}"`,
    })
  );

  return (
    resp.Users || []
  ).map((u) => {
    const attrs: Record<string, string> = {};
    (u.Attributes || []).forEach((a) => {
      if (a.Name && a.Value) attrs[a.Name] = a.Value;
    });
    return {
      id: u.Username || '',
      name: `${attrs.given_name || ''} ${attrs.family_name || ''}`.trim() || attrs.email || u.Username || '',
      email: attrs.email || '',
      activated: attrs['custom:activated'] === 'true',
    } as CompanyUser;
  });
}

export async function setUserActivated(username: string, activated: boolean) {
  const { region, userPoolId } = getClient();
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
    new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [{ Name: 'custom:activated', Value: activated ? 'true' : 'false' }],
    })
  );
}
