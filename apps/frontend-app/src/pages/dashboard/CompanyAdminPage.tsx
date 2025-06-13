import { useEffect, useRef, useState } from 'react';
import CompanyMembersCard, { CompanyMember } from '../../components/CompanyMembersCard';
import PendingPaymentsCard, { PendingPayment } from '../../components/PendingPaymentsCard';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { useAuth } from '../../contexts/AuthContext';

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
        const { data } = await client.models.User.list({
          filter: { companyId: { eq: user.company } }
        });
        setMembers(
          data.map((u) => ({
            id: u.id || '',
            name: u.name || '',
            email: u.email || '',
            active: true, // Since we don't have an activated field in the DB, assume all users are active
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
    // For now, just update the UI state since we don't have an activated field in the database
    // In the future, you could add an 'active' field to the User model and update it here
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, active: !m.active };
        }
        return m;
      })
    );
    
    // Note: This is just a UI change. To persist the status, you would need to:
    // 1. Add an 'active' or 'status' field to the User model in the schema
    // 2. Update the user record in the database here
    console.log(`Member ${id} status toggled`);
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
