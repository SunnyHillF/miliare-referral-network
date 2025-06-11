import React from 'react';
import TeamMembersCard, { TeamMember } from '../../components/TeamMembersCard';

const CompanyAdminPage = () => {
  const teamMembers: TeamMember[] = [
    { id: 1, name: 'Jane Doe', totalReferrals: 30, pendingCommissions: 1500, successRate: 75 },
    { id: 2, name: 'John Smith', totalReferrals: 20, pendingCommissions: 800, successRate: 60 },
    { id: 3, name: 'Emily Johnson', totalReferrals: 18, pendingCommissions: 950, successRate: 72 }
  ];

  const handleManageTeam = () => {
    console.log('Navigate to team management page');
  };

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
      </div>

      <TeamMembersCard members={teamMembers} onManage={handleManageTeam} />
    </div>
  );
};

export default CompanyAdminPage; 
