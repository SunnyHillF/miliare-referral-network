import React, { useState } from 'react';
import TeamMembersCard, { TeamMember } from '../../components/TeamMembersCard';
import RecentPaymentsCard, { RecentPayment } from '../../components/RecentPaymentsCard';

const CompanyAdminPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Alice Thompson', totalReferrals: 120, pendingCommissions: 3450.5, successRate: 0.76, active: true },
    { id: 2, name: 'Brian Davis', totalReferrals: 98, pendingCommissions: 2150.0, successRate: 0.64, active: true },
    { id: 3, name: 'Carla Martinez', totalReferrals: 150, pendingCommissions: 4800.75, successRate: 0.82, active: false },
  ]);

  const [payments, setPayments] = useState<RecentPayment[]>([
    { id: 1, date: '2023-06-30', amount: 3200.5, status: 'Paid', company: 'Alice Thompson', paid: true },
    { id: 2, date: '2023-06-25', amount: 2500.0, status: 'Paid', company: 'Brian Davis', paid: true },
    { id: 3, date: '2023-06-20', amount: 4100.75, status: 'Unpaid', company: 'Carla Martinez', paid: false },
  ]);



  const toggleMemberStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  const togglePaymentStatus = (id: number) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, paid: !p.paid, status: p.paid ? 'Unpaid' : 'Paid' } : p
      )
    );
  };

  const handleViewHistory = () => {
    console.log('View payment history');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Administration</h1>
        <p className="mt-1 text-sm text-gray-500">Manage companies and referral settings.</p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TeamMembersCard
          members={members}
          showStatusToggle
          onToggleStatus={toggleMemberStatus}
        />
        <RecentPaymentsCard
          payments={payments}
          onViewHistory={handleViewHistory}
          showStatusToggle
          onToggleStatus={togglePaymentStatus}
        />
      </div>

    </div>
  );
};

export default CompanyAdminPage;
