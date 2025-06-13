import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import EarningsChart, { EarningsPoint } from '../../components/EarningsChart';
import StatsOverview, { StatItem } from '../../components/StatsOverview';
import TeamMembersCard, { TeamMember } from '../../components/TeamMembersCard';
import RecentPaymentsCard, { RecentPayment } from '../../components/RecentPaymentsCard';

const OrganizationPage = () => {
  const [period, setPeriod] = useState('Last 6 months');

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

  const earningsData6Months: EarningsPoint[] = [
    { month: 'Jan', earnings: 15000 },
    { month: 'Feb', earnings: 16500 },
    { month: 'Mar', earnings: 17200 },
    { month: 'Apr', earnings: 18400 },
    { month: 'May', earnings: 19100 },
    { month: 'Jun', earnings: 20500 },
  ];

  const earningsData12Months: EarningsPoint[] = [
    { month: 'Jul', earnings: 14200 },
    { month: 'Aug', earnings: 14800 },
    { month: 'Sep', earnings: 15300 },
    { month: 'Oct', earnings: 15800 },
    { month: 'Nov', earnings: 16200 },
    { month: 'Dec', earnings: 17000 },
    ...earningsData6Months,
  ].slice(-12);

  const earningsDataYear: EarningsPoint[] = [...earningsData12Months];

  const earningsMap: Record<string, EarningsPoint[]> = {
    'Last 6 months': earningsData6Months,
    'Last 12 months': earningsData12Months,
    'Year to date': earningsDataYear,
  };

  const chartData = earningsMap[period] || earningsData6Months;

  const stats: StatItem[] = [
    { label: 'Total Earnings', value: '$112,500', icon: 'DollarSign', bgColor: 'bg-blue-100', iconColor: 'text-primary' },
    { label: 'Pending Commissions', value: '$9,850', icon: 'Clock', bgColor: 'bg-green-100', iconColor: 'text-success' },
    { label: 'Total Referrals', value: '368', icon: 'Users', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Success Rate', value: '78%', icon: 'TrendingUp', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  ];

  const toggleMemberStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  const togglePaymentStatus = (id: string | number) => {
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
        <h1 className="text-2xl font-bold text-gray-900">Your Teams Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage companies and referral settings.</p>
      </div>

      <StatsOverview stats={stats} />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Company Earnings Overview</h2>
          <div>
            <select
              className="py-1 px-3 border border-gray-300 rounded-md text-sm"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>Year to date</option>
            </select>
          </div>
        </div>
        <div className="h-64">
          <EarningsChart data={chartData} />
        </div>
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

      {/* CTA section */}
      <div className="bg-primary rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8 md:p-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Ready to increase your earnings?</h2>
            <p className="mt-1 text-primary-foreground text-opacity-90">
              Refer clients to our strategic companies and earn commissions.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link to="/dashboard/refer">
              <Button variant="outline" className="w-full md:w-auto bg-white text-primary hover:bg-gray-100">
                Make a Referral
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
