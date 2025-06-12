export type CompanyAggregateStats = {
  totalEarnings: number;
  pendingCommissions: number;
  referralsCount: number;
  successfulReferrals: number;
};

export const companyAggregateStats: Record<string, CompanyAggregateStats> = {
  'sunny-hill': {
    totalEarnings: 125000,
    pendingCommissions: 6200,
    referralsCount: 340,
    successfulReferrals: 280,
  },
  prime: {
    totalEarnings: 98000,
    pendingCommissions: 5400,
    referralsCount: 290,
    successfulReferrals: 210,
  },
  anco: {
    totalEarnings: 76000,
    pendingCommissions: 4300,
    referralsCount: 220,
    successfulReferrals: 170,
  },
  weightless: {
    totalEarnings: 54000,
    pendingCommissions: 2100,
    referralsCount: 180,
    successfulReferrals: 130,
  },
  summit: {
    totalEarnings: 88000,
    pendingCommissions: 5100,
    referralsCount: 250,
    successfulReferrals: 190,
  },
  wellness: {
    totalEarnings: 67000,
    pendingCommissions: 3200,
    referralsCount: 200,
    successfulReferrals: 150,
  },
  impact: {
    totalEarnings: 72000,
    pendingCommissions: 3500,
    referralsCount: 210,
    successfulReferrals: 160,
  },
};
