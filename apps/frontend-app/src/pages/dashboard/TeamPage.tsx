import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import EarningsChart, { EarningsPoint } from '../../components/EarningsChart';
import StatsOverview, { StatItem } from '../../components/StatsOverview';
import TeamMembersCard, { TeamMember } from '../../components/TeamMembersCard';
import RecentPaymentsCard, { RecentPayment } from '../../components/RecentPaymentsCard';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { useAuth } from '../../contexts/AuthContext';

const TeamPage = () => {
  const { user } = useAuth();
  const client = generateClient<Schema>();

  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        const { data: members } = await client.models.User.list({
          filter: { teamLeadId: { eq: user.id } },
        });

        const memberResults: TeamMember[] = [];
        let totalEarnings = 0;
        let pendingCommissions = 0;
        let referralsCount = 0;
        let successfulReferrals = 0;

        for (const m of members) {
          const { data: refs } = await client.models.Referral.list({
            filter: { userId: { eq: m.id } },
          });

          const processed = refs.filter((r) => r.paymentStatus === 'PROCESSED');
          const pending = refs.filter((r) => r.paymentStatus === 'PENDING');

          const memberPending = pending.reduce((sum, r) => sum + (r.amount || 0), 0);
          const memberSuccessRate =
            refs.length > 0 ? processed.length / refs.length : 0;

          memberResults.push({
            id: m.id || '',
            name: m.name || '',
            totalReferrals: refs.length,
            pendingCommissions: memberPending,
            successRate: memberSuccessRate,
          });

          referralsCount += refs.length;
          successfulReferrals += processed.length;
          totalEarnings += processed.reduce((sum, r) => sum + (r.amount || 0), 0);
          pendingCommissions += memberPending;
        }

        setTeamMembers(memberResults);

        setStats([
          {
            label: 'Total Earnings',
            value: `$${totalEarnings.toLocaleString()}`,
            icon: 'DollarSign',
            bgColor: 'bg-blue-100',
            iconColor: 'text-primary',
          },
          {
            label: 'Pending Commissions',
            value: `$${pendingCommissions.toLocaleString()}`,
            icon: 'Clock',
            bgColor: 'bg-green-100',
            iconColor: 'text-success',
          },
          {
            label: 'Total Referrals',
            value: referralsCount.toString(),
            icon: 'Users',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
          },
          {
            label: 'Success Rate',
            value: `${referralsCount ? Math.round((successfulReferrals / referralsCount) * 100) : 0}%`,
            icon: 'TrendingUp',
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
          },
        ]);
      } catch (err) {
        console.error('Failed to load team data', err);
      }
    };

    const loadPayments = async () => {
      if (!user?.id) return;
      try {
        const { data } = await client.models.Referral.list({
          filter: { teamLeadId: { eq: user.id } },
        });

        const payments: RecentPayment[] = [];
        for (const r of data) {
          let companyName = r.companyId;
          try {
            const { data: c } = await client.models.Company.get({ id: r.companyId });
            if (c?.companyName) companyName = c.companyName;
          } catch {
            // ignore
          }
          payments.push({
            id: r.id || '',
            date: r.createdAt || '',
            amount: r.amount || 0,
            status: r.paymentStatus === 'PROCESSED' ? 'Paid' : r.paymentStatus === 'FAILED' ? 'Failed' : 'Pending',
            company: companyName,
          });
        }
        setRecentPayments(payments);
      } catch (err) {
        console.error('Failed to load payments', err);
      }
    };

    loadData();
    loadPayments();
  }, [user, client]);

  // Team earnings data (higher values than individual business)
  const earningsData6Months: EarningsPoint[] = [
    { month: 'Jan', earnings: 6500 },
    { month: 'Feb', earnings: 7200 },
    { month: 'Mar', earnings: 8100 },
    { month: 'Apr', earnings: 9200 },
    { month: 'May', earnings: 8800 },
    { month: 'Jun', earnings: 9400 },
  ];

  const earningsData12Months: EarningsPoint[] = [
    { month: 'Jul', earnings: 7800 },
    { month: 'Aug', earnings: 8200 },
    { month: 'Sep', earnings: 8600 },
    { month: 'Oct', earnings: 9100 },
    { month: 'Nov', earnings: 9500 },
    { month: 'Dec', earnings: 10200 },
    ...earningsData6Months,
  ].slice(-12);

  const earningsDataYear: EarningsPoint[] = [...earningsData12Months];

  const [period, setPeriod] = useState('Last 6 months');

  const earningsMap: Record<string, EarningsPoint[]> = {
    'Last 6 months': earningsData6Months,
    'Last 12 months': earningsData12Months,
    'Year to date': earningsDataYear,
  };

  const chartData = earningsMap[period] || earningsData6Months;

  const handleViewAllMembers = () => {
    console.log('Navigate to all team members page');
  };

  const handleViewPaymentHistory = () => {
    console.log('Navigate to team payment history page');
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Team Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Aggregate performance of your team members
        </p>
      </div>
      
      {/* Stats overview */}
      <StatsOverview stats={stats} />
      
      {/* Earnings Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Earnings Overview</h2>
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
        {/* Team Members Component */}
        <TeamMembersCard
          members={teamMembers}
          onViewAll={handleViewAllMembers}
        />
        
        {/* Recent Payments Component */}
        <RecentPaymentsCard 
          payments={recentPayments}
          onViewHistory={handleViewPaymentHistory}
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

export default TeamPage;
