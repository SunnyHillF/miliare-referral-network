import React, { useState, useEffect } from 'react';
// Icons are referenced by name via an icon map; avoid importing unused icons
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import EarningsChart, { EarningsPoint } from '../../components/EarningsChart';
import PendingReferralsCard, { PendingReferral } from '../../components/PendingReferralsCard';
import RecentPaymentsCard, { RecentPayment } from '../../components/RecentPaymentsCard';
import StatsOverview, { StatItem } from '../../components/StatsOverview';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { useAuth } from '../../contexts/AuthContext';

const client = generateClient<Schema>();

const BusinessPage = () => {
  const { user } = useAuth();

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingCommissions, setPendingCommissions] = useState(0);
  const [referralsCount, setReferralsCount] = useState(0);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [pendingReferrals, setPendingReferrals] = useState<PendingReferral[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        const { data } = await client.models.Referral.list({
          filter: { userId: { eq: user.id } },
        });

        const companies: Record<string, string> = {};
        const getCompanyName = async (id: string) => {
          if (!companies[id]) {
            try {
              const { data: company } = await client.models.Company.get({ id });
              companies[id] = company?.companyName || id;
            } catch {
              companies[id] = id;
            }
          }
          return companies[id];
        };

        let totalEarn = 0;
        let pendingComm = 0;
        let successCount = 0;

        const pending: PendingReferral[] = [];
        const payments: RecentPayment[] = [];

        for (const r of data) {
          const companyName = await getCompanyName(r.companyId);

          if (r.paymentStatus === 'PROCESSED') {
            successCount += 1;
            totalEarn += r.amount ?? 0;
            payments.push({
              id: r.id,
              date: r.processedAt || r.createdAt || '',
              amount: r.amount || 0,
              status: 'Paid',
              company: companyName,
            });
          }

          if (
            r.paymentStatus === 'PENDING' ||
            r.status === 'IN_PROGRESS' ||
            r.status === 'IN_REVIEW'
          ) {
            pendingComm += r.amount ?? 0;
            pending.push({
              id: r.id,
              date: r.createdAt || '',
              client: r.name,
              company: companyName,
              status:
                r.status === 'IN_PROGRESS'
                  ? 'In Process'
                  : r.status?.replace('_', ' ') || 'In Process',
              estimatedCommission: r.amount ?? null,
            });
          }
        }

        payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTotalEarnings(totalEarn);
        setPendingCommissions(pendingComm);
        setReferralsCount(data.length);
        setSuccessfulReferrals(successCount);
        setRecentPayments(payments.slice(0, 4));
        setPendingReferrals(pending.slice(0, 3));
      } catch (error) {
        console.error('Failed to load business data', error);
      }
    };

    loadData();
  }, [user]);

  const earningsData6Months: EarningsPoint[] = [
    { month: 'Jan', earnings: 2000 },
    { month: 'Feb', earnings: 2500 },
    { month: 'Mar', earnings: 3000 },
    { month: 'Apr', earnings: 3500 },
    { month: 'May', earnings: 2800 },
    { month: 'Jun', earnings: 2950 },
  ];

  const earningsData12Months: EarningsPoint[] = [
    { month: 'Jul', earnings: 3100 },
    { month: 'Aug', earnings: 3300 },
    { month: 'Sep', earnings: 3400 },
    { month: 'Oct', earnings: 3600 },
    { month: 'Nov', earnings: 3700 },
    { month: 'Dec', earnings: 3900 },
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

  const stats: StatItem[] = [
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
      value: `${Math.round((successfulReferrals / referralsCount) * 100)}%`,
      icon: 'TrendingUp',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const handleViewAllReferrals = () => {
    console.log('Navigate to all referrals page');
  };

  const handleViewPaymentHistory = () => {
    console.log('Navigate to payment history page');
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Business Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your referrals, earnings, and pending commissions
        </p>
      </div>
      
      {/* Stats overview */}
      <StatsOverview stats={stats} />
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
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
        {/* Pending Referrals Component */}
        <PendingReferralsCard 
          referrals={pendingReferrals}
          onViewAll={handleViewAllReferrals}
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

export default BusinessPage;
