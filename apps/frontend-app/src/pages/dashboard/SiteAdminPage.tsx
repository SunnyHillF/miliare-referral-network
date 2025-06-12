import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const iconMap = { RefreshCw };

function generateApiKey() {
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, (val) => val.toString(16).padStart(8, '0')).join('');
}

const SiteAdminPage = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const RefreshIcon = iconMap.RefreshCw;

  const handleRegenerate = () => {
    const key = generateApiKey();
    setApiKey(key);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage companies and referral settings.</p>
      </div>



      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <p className="text-gray-700">
          This page is accessible to Company Admins and Site Admins. Manage company settings, company configurations, and referral workflows here.
        </p>
        <div>
          <p className="text-sm text-gray-500">Webhook Endpoint:</p>
          <code className="text-sm">POST /webhook/referrals/&lt;referralId&gt;</code>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">API Key:</p>
          <span className="font-mono text-sm">{apiKey ? apiKey : '********'}</span>
          <Button size="sm" variant="outline" onClick={handleRegenerate}>
            <RefreshIcon className="h-4 w-4 mr-1" /> Regenerate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiteAdminPage;
