import React, { useState } from 'react';
import Modal from './ui/Modal';
import { Button } from './ui/Button';

import { PendingReferral } from './PendingReferralsCard';

interface ReferralModalProps {
  referral: PendingReferral | null;
  open: boolean;
  onClose: () => void;
  onSave: (referral: PendingReferral) => void;
}

const statuses = ['In Progress', 'In Review', 'Completed'];

const ReferralModal: React.FC<ReferralModalProps> = ({ referral, open, onClose, onSave }) => {
  const [status, setStatus] = useState(referral?.status ?? statuses[0]);

  React.useEffect(() => {
    if (referral) setStatus(referral.status);
  }, [referral]);

  if (!referral) return null;

  function handleSave() {
    onSave({ ...referral, status });
  }

  return (
    <Modal open={open} onClose={onClose} title="Referral Details">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Client</p>
          <p className="font-medium text-gray-900">{referral.client}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Company</p>
          <p className="font-medium text-gray-900">{referral.company}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estimated Commission</p>
          <p className="font-medium text-gray-900">${referral.estimatedCommission.toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReferralModal;
