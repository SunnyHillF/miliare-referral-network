import React from 'react';
import { Button } from './ui/Button';

export type TeamMember = {
  id: number;
  name: string;
  totalReferrals: number;
  pendingCommissions: number;
  successRate: number; // percentage
};

interface TeamMembersCardProps {
  members: TeamMember[];
  onManage?: () => void;
}

const TeamMembersCard: React.FC<TeamMembersCardProps> = ({ members, onManage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        {onManage && (
          <Button variant="outline" size="sm" onClick={onManage}>
            Manage
          </Button>
        )}
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {members.map((member) => (
          <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">
              {member.totalReferrals} referrals
            </p>
            <p className="text-sm text-gray-500">
              Pending: ${member.pendingCommissions.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Success Rate: {member.successRate}%
            </p>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Referrals
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending Commissions
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.totalReferrals}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${member.pendingCommissions.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.successRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersCard;
