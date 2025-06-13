import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import Modal from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { toast } from './ui/Toaster';
import type { PendingReferral } from './PendingReferralsCard';

interface ReferralDetailsModalProps {
  referral: PendingReferral | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (id: string, newStatus: string) => void;
}

const ReferralDetailsModal: React.FC<ReferralDetailsModalProps> = ({
  referral,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const client = generateClient<Schema>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('IN_PROGRESS');

  const statusOptions = [
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'PAID', label: 'Paid' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  useEffect(() => {
    if (referral?.status) {
      setStatus(referral.status);
    }
  }, [referral]);

  const updateStatus = async () => {
    if (!referral) return;
    setLoading(true);
    try {
      await client.models.Referral.update({
        id: String(referral.id),
        status: status as Schema['Referral']['type']['status'],
        ...(status === 'PAID' ? { paymentStatus: 'PENDING' } : {}),
      });
      const label = statusOptions.find((o) => o.value === status)?.label || status;
      toast.success('Referral updated', `Status changed to ${label}`);
      onStatusUpdated?.(String(referral.id), status);
      onClose();
    } catch (err) {
      console.error('Failed to update referral status', err);
      toast.error('Update failed', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!referral) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Referral Details">
      <div className="space-y-2">
        <p>
          <strong>Client:</strong> {referral.client}
        </p>
        <p>
          <strong>Company:</strong> {referral.company}
        </p>
        <p>
          <strong>Date:</strong> {new Date(referral.date).toLocaleDateString()}
        </p>
        <div>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions.map((opt) => ({
              ...opt,
              disabled: opt.value === referral.status,
            }))}
          />
        </div>
        {typeof referral.estimatedCommission === 'number' && (
          <p>
            <strong>Commission:</strong> ${referral.estimatedCommission.toLocaleString()}
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button onClick={updateStatus} disabled={loading}>
          Update Status
        </Button>
      </div>
    </Modal>
  );
};

export default ReferralDetailsModal;
