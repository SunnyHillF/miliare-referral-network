import React from 'react';
import {
  BadgeCheck,
  Landmark,
  Wallet,
  HeartPulse,
  DollarSign,
  Briefcase,
  Users
} from 'lucide-react';

export type CompanyMeta = {
  icon: React.ReactNode;
  tags: string[];
  bgColor?: string;
  referralUrl?: string;
  hasTraining?: boolean;
  hasDocumentation?: boolean;
  commissionInfo?: {
    rate: string;
    average: string;
  };
};

export const companyMeta: Record<string, CompanyMeta> = {
  'sunny-hill': {
    icon: <DollarSign className="h-6 w-6 text-blue-600" />,
    tags: ['Financial Planning', 'Investment', 'Retirement'],
    bgColor: '#dbeafe',
    referralUrl: 'https://sunnyhillfinancial.com/refer',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: { rate: '15%', average: '$850' },
  },
  prime: {
    icon: <Briefcase className="h-6 w-6 text-green-600" />,
    tags: ['Business Services', 'Tax', 'Bookkeeping', 'Estate Planning'],
    bgColor: '#dcfce7',
    referralUrl: 'https://www.primecorporateservices.com/refer',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: { rate: '20%', average: '$1,200' },
  },
  anco: {
    icon: <BadgeCheck className="h-6 w-6 text-red-600" />,
    tags: ['Insurance', 'Employee Benefits', 'Business Insurance'],
    bgColor: '#fee2e2',
    referralUrl: 'https://www.anco.com/refer',
    hasTraining: true,
    hasDocumentation: false,
    commissionInfo: { rate: '20%', average: '$950' },
  },
  weightless: {
    icon: <Wallet className="h-6 w-6 text-purple-600" />,
    tags: ['Debt Resolution', 'Financial Education', 'Credit Repair'],
    bgColor: '#f3e8ff',
    referralUrl: 'https://weightlessfinancial.com/refer',
    hasTraining: false,
    hasDocumentation: true,
    commissionInfo: { rate: 'Variable', average: '$500' },
  },
  summit: {
    icon: <Landmark className="h-6 w-6 text-yellow-600" />,
    tags: ['401k', 'Retirement Plans', 'Employee Benefits'],
    bgColor: '#fef3c7',
    referralUrl: '/dashboard/refer/summit',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: { rate: '25%', average: '$1,500' },
  },
  wellness: {
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    tags: ['Healthcare', 'Wellness Programs', 'Employee Benefits'],
    bgColor: '#e0e7ff',
    referralUrl: 'https://wellnessfortheworkforce.com/refer',
    hasTraining: false,
    hasDocumentation: false,
    commissionInfo: { rate: 'Direct Payment', average: 'Varies' },
  },
  impact: {
    icon: <HeartPulse className="h-6 w-6 text-pink-600" />,
    tags: ['Health Sharing', 'Healthcare Alternative', 'Medical Cost Sharing'],
    bgColor: '#fce7f3',
    referralUrl: 'https://www.impacthealthsharing.com/refer',
    hasTraining: true,
    hasDocumentation: true,
    commissionInfo: { rate: 'TBD', average: 'TBD' },
  },
};
