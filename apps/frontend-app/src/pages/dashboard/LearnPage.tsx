import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Bookmark,
  Building2,
} from 'lucide-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { Button } from '../../components/ui/Button';
import {
  companyMeta,
  type CompanyMeta,
  getCompanyMetaKey,
} from '../../data/companyMeta';

const client = generateClient<Schema>();

const defaultMeta: CompanyMeta = {
  icon: <Building2 className="h-6 w-6 text-gray-500" />,
  tags: [],
  bgColor: '#f3f4f6',
};

const LearnPage = () => {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learn About Our Companies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover our strategic companies and how to effectively refer clients
        </p>
      </div>
      
      {/* Featured section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-primary md:w-48 flex items-center justify-center p-6">
            <BookOpen className="h-16 w-16 text-white" />
          </div>
          <div className="p-6">
            <div className="uppercase tracking-wide text-sm text-primary font-semibold">Featured Resource</div>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Complete Guide to Successful Referrals</h2>
            <p className="mt-3 text-gray-500">
              Learn how to identify the right opportunities, position our companies' services effectively, and maximize your commissions.
            </p>
            <div className="mt-4">
              <Button className="inline-flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Download Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const meta =
            companyMeta[
              getCompanyMetaKey(company.companyName || '')
            ] ||
            defaultMeta;
          return (
            <div key={company.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: meta.bgColor || '#f3f4f6' }}
                  >
                    {meta.icon}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500" title="Save for later">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>

              <h3 className="mt-4 text-lg font-medium text-gray-900">{company.companyName}</h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                {company.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(meta.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2 items-center">
                  {meta.hasTraining && (
                    <span title="Training available" className="text-primary">
                      <Video className="h-5 w-5" />
                    </span>
                  )}
                  {meta.hasDocumentation && (
                    <span title="Documentation available" className="text-primary">
                      <FileText className="h-5 w-5" />
                    </span>
                  )}
                  {meta.referralUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(meta.referralUrl, '_blank', 'noopener,noreferrer')}
                    >
                      Refer
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Link
                  to={`/dashboard/companies/${company.id}`}
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
                >
                  Learn more
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Video className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Training Videos</h3>
              <p className="mt-1 text-xs text-gray-500">Watch step-by-step tutorials</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Documentation</h3>
              <p className="mt-1 text-xs text-gray-500">Detailed guides and manuals</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Educational Content</h3>
              <p className="mt-1 text-xs text-gray-500">Articles and case studies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
