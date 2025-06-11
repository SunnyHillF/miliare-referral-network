import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrative tools and settings.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-700">Only users in the admin group can see this page.</p>
        <div className="mt-4">
          <Link to="/dashboard/admin/new-partner" className="text-primary underline">
            Create Partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
