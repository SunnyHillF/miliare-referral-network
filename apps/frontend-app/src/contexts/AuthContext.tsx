import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, signUp, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
/* eslint react-refresh/only-export-components: 0 */

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  company: string;
  groups: string[];
  teamId?: string;
  orgLeadId?: string;
  activated?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    userData: Omit<User, 'id' | 'groups'> & { password: string }
  ) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      if (currentUser && session.tokens) {
        const groups =
          (session.tokens.idToken?.payload['cognito:groups'] as string[]) || [];

        const attributes = await fetchUserAttributes();

        const userData: User = {
          id: currentUser.userId,
          firstName: attributes.given_name ?? 'User',
          lastName: attributes.family_name ?? '',
          email: attributes.email ?? currentUser.signInDetails?.loginId ?? '',
          phoneNumber: attributes.phone_number ?? undefined,
          address: attributes.address ?? undefined,
          company: attributes['custom:companyId'] ?? 'WFG',
          groups,
          teamId: attributes['custom:teamId'] ?? undefined,
          orgLeadId: attributes['custom:orgLeadId'] ?? undefined,
          activated: attributes['custom:activated'] === 'true',
        };
        setUser(userData);
      }
    } catch (error) {
      // Only log errors that aren't expected "not authenticated" scenarios
      if (error && typeof error === 'object' && 'name' in error && error.name !== 'UserUnAuthenticatedException') {
        console.error('Error checking auth status:', error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      // If a user is already authenticated, sign them out first to avoid
      // "UserAlreadyAuthenticatedException" errors from Amplify.
      try {
        await getCurrentUser();
        await signOut();
      } catch {
        // getCurrentUser throws if no user is signed in; ignore in that case
      }

      // Store the remember me preference (for UI state)
      localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

      const { isSignedIn } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        await checkAuthStatus();
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (
    userData: Omit<User, 'id' | 'groups'> & { password: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { isSignUpComplete } = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            given_name: userData.firstName,
            family_name: userData.lastName,
            phone_number: userData.phoneNumber,
            address: userData.address,
            // Map the selected company to the CompanyId custom attribute in Cognito
            'custom:companyId': userData.company,
            'custom:teamId': userData.teamId || '',
            'custom:orgLeadId': userData.orgLeadId || '',
            'custom:activated': userData.activated ? 'true' : 'false',
          },
        },
      });
      
      if (isSignUpComplete) {
        // Auto-sign in after successful registration
        await login(userData.email, userData.password);
        // login() will handle setting isLoading(false) via checkAuthStatus
        return true;
      } else {
        // User needs to verify email - not complete yet
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const attributes: Record<string, string> = {};
      if (updates.firstName !== undefined) {
        attributes['given_name'] = updates.firstName;
      }
      if (updates.lastName !== undefined) {
        attributes['family_name'] = updates.lastName;
      }
      if (updates.phoneNumber !== undefined) {
        attributes['phone_number'] = updates.phoneNumber;
      }
      if (updates.address !== undefined) {
        attributes['address'] = updates.address;
      }
      if (updates.company !== undefined) {
        attributes['custom:companyId'] = updates.company;
      }
      if (updates.teamId !== undefined) {
        attributes['custom:teamId'] = updates.teamId;
      }
      if (updates.orgLeadId !== undefined) {
        attributes['custom:orgLeadId'] = updates.orgLeadId;
      }
      if (updates.activated !== undefined) {
        attributes['custom:activated'] = updates.activated ? 'true' : 'false';
      }
      if (Object.keys(attributes).length > 0) {
        const { updateUserAttributes } = await import('aws-amplify/auth');
        await updateUserAttributes({ userAttributes: attributes });
        await checkAuthStatus();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
