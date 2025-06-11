import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CompanyAdminPage = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage partner companies and referral settings.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-700">
          This page is accessible to Partner Admins and Site Admins.
          Manage company settings, partner configurations, and referral workflows here.
        </p>
        {user?.groups?.includes('admin') && (
          <div className="mt-4">
            <Link to="/dashboard/company-admin/new-partner" className="text-primary underline">
              Create Partner
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyAdminPage;

