import { useEffect, useRef, useState } from 'react';
import CompanyMembersCard, { CompanyMember } from '../../components/CompanyMembersCard';
import PendingPaymentsCard, { PendingPayment } from '../../components/PendingPaymentsCard';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { useAuth } from '../../contexts/AuthContext';
import { listCompanyUsers, setUserActivated, CompanyUser } from '../../utils/manageUsers';

const CompanyAdminPage = () => {
  const { user } = useAuth();
  const client = generateClient<Schema>();
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [payments, setPayments] = useState<PendingPayment[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!user?.company) return;
      try {
        const users = await listCompanyUsers(user.company);
        setMembers(
          users.map((u: CompanyUser) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            active: u.activated,
          }))
        );
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    const loadPayments = async () => {
      if (!user?.company) return;
      try {
        const { data } = await client.models.Referral.list({
          filter: {
            companyId: { eq: user.company },
            paymentStatus: { eq: 'PENDING' },
          },
        });

        const results: PendingPayment[] = [];
        for (const r of data) {
          let name = r.userId;
          try {
            const { data: u } = await client.models.User.get({ id: r.userId });
            if (u?.name) name = u.name;
          } catch {
            // ignore
          }
          results.push({
            id: r.id || '',
            date: r.createdAt || '',
            amount: r.amount || 0,
            status: 'Pending',
            company: name,
          });
        }
        setPayments(results);
      } catch (err) {
        console.error('Failed to load payments', err);
      }
    };

    loadMembers();
    loadPayments();
  }, [user, client]);



  const toggleMemberStatus = (id: string | number) => {
    let newStatus = false;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          newStatus = !m.active;
          return { ...m, active: newStatus };
        }
        return m;
      })
    );

    clearTimeout(timers.current[String(id)]);
    timers.current[String(id)] = setTimeout(async () => {
      try {
        await setUserActivated(String(id), newStatus);
      } catch (err) {
        console.error('Failed to update user', err);
      }
    }, 10000);
  };

  const changePaymentStatus = (id: string | number, status: 'PROCESSED' | 'FAILED') => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: status === 'PROCESSED' ? 'Processed' : 'Failed' } : p))
    );

    clearTimeout(timers.current[`pay-${id}`]);
    timers.current[`pay-${id}`] = setTimeout(async () => {
      try {
        await client.models.Referral.update({ id: String(id), paymentStatus: status, processedAt: new Date().toISOString() });
        setPayments((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error('Failed to update referral', err);
      }
    }, 10000);
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
        <CompanyMembersCard
          members={members}
          onToggleStatus={toggleMemberStatus}
        />
        <PendingPaymentsCard
          payments={payments}
          onViewHistory={handleViewHistory}
          onStatusChange={changePaymentStatus}
        />
      </div>

    </div>
  );
};

export default CompanyAdminPage;
