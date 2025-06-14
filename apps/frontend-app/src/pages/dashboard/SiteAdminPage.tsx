import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { useAuth } from '../../contexts/AuthContext';

function generateApiKey() {
  // Generate a shorter, more manageable API key (32 characters)
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, (val) => val.toString(16).padStart(8, '0')).join('');
}

async function hashApiKey(apiKey: string): Promise<string> {
  // Create SHA-256 hash using Web Crypto API (no external dependency needed)
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey.trim()); // Trim to match handler behavior
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const SiteAdminPage = () => {
  const { user, isLoading: userLoading } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [company, setCompany] = useState<Schema['Company']['type'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [endpointCopied, setEndpointCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = generateClient<Schema>();
  const RefreshIcon = RefreshCw;
  const CopyIcon = copied ? Check : Copy;
  const EndpointCopyIcon = endpointCopied ? Check : Copy;

  // Load company data on component mount
  useEffect(() => {
    if (!user?.companyId) {
      setError('No company ID found for user');
      return;
    }

    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the user's specific company
        const { data } = await client.models.Company.get({ id: user.companyId });
        if (data) {
          setCompany(data);
          console.log('Loaded company:', data);
        } else {
          setError('Company not found');
        }
      } catch (err) {
        setError(`Failed to load company data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error loading company:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [user?.companyId]); // Remove client from dependencies to prevent infinite loop

  const handleRegenerate = async () => {
    console.log('handleRegenerate called, company:', company);
    console.log('User groups:', user?.groups);
    
    if (!company) {
      setError('No company found');
      return;
    }

    // Check if user has permission to update company
    const canUpdate = user?.groups?.includes('siteAdmin');
    if (!canUpdate) {
      setError('You do not have permission to update API keys. Required role: siteAdmin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Generate new API key
      const newApiKey = generateApiKey();
      console.log('Generated new API key:', newApiKey);
      
      const hashedKey = await hashApiKey(newApiKey);
      console.log('Generated hash:', hashedKey);
      
      // Update company with new hashed API key
      console.log('Updating company with ID:', company.id);
      console.log('Update payload:', { id: company.id, webhookApiKeyHash: hashedKey });
      
      const updatedCompany = await client.models.Company.update({
        id: company.id,
        webhookApiKeyHash: hashedKey
      });

      console.log('Update result:', updatedCompany);
      console.log('Update errors:', updatedCompany.errors);

      if (updatedCompany.errors && updatedCompany.errors.length > 0) {
        const errorMessage = updatedCompany.errors.map(e => e.message).join(', ');
        setError(`Update failed with errors: ${errorMessage}`);
        console.error('GraphQL errors:', updatedCompany.errors);
        return;
      }

      if (updatedCompany.data) {
        setCompany(updatedCompany.data);
        setApiKey(newApiKey); // Show the plain key temporarily
        console.log('API key set successfully');
        
        // Clear the plain key after 30 seconds for security
        setTimeout(() => {
          setApiKey(null);
        }, 30000);
      } else {
        setError('Update succeeded but no data returned');
        console.error('No data in update response:', updatedCompany);
      }
    } catch (err) {
      setError(`Failed to regenerate API key: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error updating API key:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (apiKey) {
      try {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy API key:', err);
      }
    }
  };

  const handleCopyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText('https://api.miliarereferral.com/webhook/referrals/{referralId}');
      setEndpointCopied(true);
      setTimeout(() => setEndpointCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy endpoint:', err);
    }
  };

  if (userLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
          <p className="mt-1 text-sm text-gray-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
          <p className="mt-1 text-sm text-red-500">User not authenticated</p>
        </div>
      </div>
    );
  }

  // Check if user has siteAdmin access
  const isSiteAdmin = user?.groups?.includes('siteAdmin');
  if (!isSiteAdmin) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
          <p className="mt-1 text-sm text-red-500">Access denied. This page is restricted to Site Administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
        <p className="mt-1 text-sm text-gray-500">Manage companies and referral settings.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Debug info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-blue-900 font-medium mb-2">Debug Information</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>User Groups:</strong> {user?.groups?.join(', ') || 'None'}</p>
          <p><strong>User Company ID:</strong> {user?.companyId}</p>
          <p><strong>Loaded Company ID:</strong> {company?.id}</p>
          <p><strong>Company Name:</strong> {company?.companyName}</p>
          <p><strong>Has API Key Hash:</strong> {company?.webhookApiKeyHash ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h2>
          <p className="text-gray-700 mb-4">
            This page is accessible to Site Administrators only. Manage company settings, company configurations, and referral workflows here.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Webhook Endpoint:</p>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleCopyEndpoint}
                className="h-8 w-8 p-0"
              >
                <EndpointCopyIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className={`p-3 rounded border font-mono text-sm break-all ${
              'bg-gray-50'
            }`}>
              https://api.miliarereferral.com/webhook/referrals/{'{referralId}'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Replace {'{referralId}'} with the actual referral ID when making requests
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">HTTP Method:</p>
            <div className="p-2 bg-blue-50 rounded border inline-block">
              <span className="text-blue-800 font-semibold text-sm">POST</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Required Headers:</p>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                <span className="text-gray-600">Content-Type:</span> application/json
              </div>
              <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                <span className="text-gray-600">x-api-key:</span> {apiKey ? apiKey : '[Your API Key]'}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Company ID:</p>
            <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
              {company?.id || 'Loading...'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use this company ID in your webhook requests
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Request Body Example:</p>
            <div className="p-3 bg-gray-50 rounded border font-mono text-sm">
              <pre>{JSON.stringify({ companyId: company?.id || "<companyId>", status: "PAID" }, null, 2)}</pre>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Valid status values: IN_PROGRESS, IN_REVIEW, PAID, REJECTED
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">API Key:</p>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRegenerate}
                  disabled={loading}
                >
                  <RefreshIcon className="h-4 w-4 mr-1" /> 
                  {loading ? 'Generating...' : 'Regenerate'}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
              <span className="font-mono text-sm flex-1">
                {apiKey ? apiKey : company?.webhookApiKeyHash ? '••••••••••••••••' : 'No API key generated'}
              </span>
              {apiKey && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCopyApiKey}
                  className="h-8 w-8 p-0"
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {apiKey && (
              <p className="text-xs text-amber-600">
                ⚠️ Copy this key now - it will be hidden in 30 seconds for security
              </p>
            )}
            
            {company?.webhookApiKeyHash && !apiKey && (
              <p className="text-xs text-gray-500">
                API key is configured. Generate a new one if needed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteAdminPage;
