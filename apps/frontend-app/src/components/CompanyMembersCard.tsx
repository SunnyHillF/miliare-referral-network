import React from 'react'
import { Button } from './ui/Button'

export type CompanyMember = {
  id: string | number
  name: string
  email?: string
  active?: boolean
}

interface CompanyMembersCardProps {
  members: CompanyMember[]
  onToggleStatus?: (id: string | number) => void
}

const CompanyMembersCard: React.FC<CompanyMembersCardProps> = ({ members, onToggleStatus }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Members</h2>

      <div className="block md:hidden space-y-4">
        {members.map((member) => (
          <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{member.name}</h3>
            {member.email && <p className="text-sm text-gray-600 mb-2">{member.email}</p>}
            {onToggleStatus && (
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => onToggleStatus(member.id)}>
                  {member.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {onToggleStatus && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                {onToggleStatus && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="outline" size="sm" onClick={() => onToggleStatus(member.id)}>
                      {member.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompanyMembersCard
