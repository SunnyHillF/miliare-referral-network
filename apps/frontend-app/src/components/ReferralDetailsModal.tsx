import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import Modal from './ui/Modal';
import { Button } from './ui/Button';
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

  const updateStatus = async () => {
    if (!referral) return;
    setLoading(true);
    try {
      await client.models.Referral.update({
        id: String(referral.id),
        status: 'PAID',
        paymentStatus: 'PENDING',
      });
      toast.success('Referral updated', 'Status changed to Paid');
      onStatusUpdated?.(String(referral.id), 'PAID');
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
          <strong>Status:</strong> {referral.status}
        </p>
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
          Mark as Paid
        </Button>
      </div>
    </Modal>
  );
};

export default ReferralDetailsModal;
