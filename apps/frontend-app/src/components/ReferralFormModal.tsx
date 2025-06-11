import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from './ui/Toaster';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(1, 'Phone number is required'),
  referralType: z.string().min(1, 'Type of referral is required'),
  value: z.string().min(1, 'Approximate value is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ReferralFormModalProps {
  partnerName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReferralFormModal: React.FC<ReferralFormModalProps> = ({ partnerName, isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const webhookUrl = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;
      if (!webhookUrl) {
        console.error('VITE_ZAPIER_WEBHOOK_URL not defined');
        toast.error('Configuration error', 'Webhook URL missing.');
        return;
      }
      const formData = new URLSearchParams();
      Object.entries({ ...data, source: partnerName }).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      toast.success('Referral submitted', 'Thank you for your referral.');
      close();
    } catch (error) {
      console.error('Referral submit error:', error);
      toast.error('Submission failed', 'Please try again later.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={partnerName ? `Refer to ${partnerName}` : 'Refer Client'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone Number" type="tel" {...register('phone')} error={errors.phone?.message} />
        <Input label="Type of Referral" {...register('referralType')} error={errors.referralType?.message} />
        <Input label="Approximate Value" {...register('value')} error={errors.value?.message} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={close}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReferralFormModal;
