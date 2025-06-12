import React, { useState, useEffect } from 'react';
import {
  Send,
  CircleDollarSign,
  BadgePercent,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { companyMeta } from '../../data/companyMeta';
import { toast } from '../../components/ui/Toaster';
import ReferralFormModal from '../../components/ReferralFormModal';

const client = generateClient<Schema>();

const ReferPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCompany, setActiveCompany] = useState<{ id: string; name: string } | null>(null);
  const [companies, setCompanies] = useState<Schema['Company']['type'][]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await client.models.Company.list();
        setCompanies(data);
      } catch (err) {
        console.error('Failed to load companies', err);
      }
    };
    fetchCompanies();
  }, []);

  const categories = Array.from(
    new Set(
      companies.map((c) => companyMeta[c.id]?.tags || []).flat()
    )
  );

  const filteredCompanies = companies.filter((company) => {
    const meta = companyMeta[company.id] || { tags: [] };
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      (company.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? meta.tags.includes(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refer Clients</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect your clients with our strategic companies and earn commissions
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/3">
            <Input
              type="search"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Companies grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => {
          const meta = companyMeta[company.id] || {};
          return (
          <div key={company.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: meta.bgColor || '#f3f4f6' }}
                    >
                      {meta.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-500">
                      {(meta.tags || []).join(' • ')}
                    </p>
                  </div>
                </div>
              
              <p className="mt-4 text-sm text-gray-500 line-clamp-3">
                {company.description}
              </p>

              {meta.commissionInfo && (
                <div className="mt-4 bg-gray-50 rounded-md p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <BadgePercent className="h-5 w-5 text-primary mr-1" />
                      <span className="text-sm text-gray-700">{meta.commissionInfo.rate}</span>
                    </div>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-5 w-5 text-success mr-1" />
                      <span className="text-sm text-gray-700">{meta.commissionInfo.average}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/r/${company.id}`);
                    toast.success("Referral link copied!", "You can now share this with your clients.");
                  }}
                >
                  <LinkIcon className="mr-1 h-4 w-4" />
                  Copy Link
                </Button>
                
                <Button
                  className="w-full flex items-center justify-center"
                  size="sm"
                  onClick={() => setActiveCompany({ id: company.id, name: company.name })}
                >
                  <Send className="mr-1 h-4 w-4" />
                  Refer Now
                </Button>
              </div>
            </div>
          </div>
        );
        })}
      </div>
      
      {filteredCompanies.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No companies found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSelectedCategory(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      
      {/* Referral tips */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8 text-white">
          <h2 className="text-xl font-bold">Tips for Successful Referrals</h2>
          <p className="mt-2 text-primary-foreground text-opacity-90">
            Maximize your commissions with these best practices
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold">Qualify Your Leads</h3>
              <p className="mt-2 text-sm text-white text-opacity-90">
                Ensure clients have a genuine need for the service before referring.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold">Explain the Value</h3>
              <p className="mt-2 text-sm text-white text-opacity-90">
                Clearly communicate how the service will benefit your client.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold">Follow Up</h3>
              <p className="mt-2 text-sm text-white text-opacity-90">
                Check in with clients after making a referral to ensure satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ReferralFormModal
        company={activeCompany}
        isOpen={Boolean(activeCompany)}
        onClose={() => setActiveCompany(null)}
      />
    </div>
  );
};

export default ReferPage;
