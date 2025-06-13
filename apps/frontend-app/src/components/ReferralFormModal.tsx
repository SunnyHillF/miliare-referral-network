import React from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from './ui/Toaster';

const formSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').regex(/^[\d\s\-\(\)\+\.]+$/, 'Please enter a valid phone number'),
  referralType: z.string().trim().min(3, 'Please describe the type of referral (minimum 3 characters)').max(200, 'Description too long'),
  value: z.string().trim().min(1, 'Approximate value is required')
    .refine((val: string) => {
      const num = parseFloat(val.replace(/[,$]/g, ''));
      return !isNaN(num) && num > 0;
    }, 'Please enter a valid dollar amount greater than 0')
    .transform((val: string) => {
      // Clean the value and ensure it's a valid number
      const cleaned = val.replace(/[,$]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? '0' : num.toString();
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface ReferralFormModalProps {
  company: { id: string; name: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReferralFormModal: React.FC<ReferralFormModalProps> = ({ company, isOpen, onClose }) => {
  const { user } = useAuth();
  const client = generateClient<Schema>();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    if (!user?.id || !company?.id) {
      toast.error('Missing user or company information');
      return;
    }

    try {
      const webhookUrl = import.meta.env.VITE_ZAPIER_WEBHOOK_URL;

      if (webhookUrl) {
        const formData = new URLSearchParams();
        Object.entries({ ...data, source: company?.name }).forEach(([key, value]) => {
          formData.append(key, String(value));
        });

        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });

        if (!resp.ok) {
          throw new Error(`API request failed with ${resp.status}`);
        }
      }

      // Clean and validate the value one more time before saving
      const cleanedValue = data.value.replace(/[,$]/g, '');
      const approximateValue = parseFloat(cleanedValue);
      const finalValue = isNaN(approximateValue) || approximateValue <= 0 ? null : approximateValue;

      await client.models.Referral.create({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phone.trim(),
        approximateValue: finalValue,
        notes: data.referralType.trim(),
        status: 'IN_PROGRESS',
        userId: user.id,
        companyId: company.id,
        createdAt: new Date().toISOString(),
      });

      toast.success('Referral submitted', 'Thank you for your referral.');
      close();
    } catch (error) {
      console.error('Referral submit error:', error);
      toast.error('Submission failed', 'Please try again later.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={company ? `Refer to ${company.name}` : 'Refer Client'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone Number" type="tel" {...register('phone')} error={errors.phone?.message} />
        <Input label="Type of Referral" {...register('referralType')} error={errors.referralType?.message} />
        <Input 
          label="Approximate Value" 
          placeholder="e.g., $5,000 or 5000"
          {...register('value')} 
          error={errors.value?.message} 
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={close}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReferralFormModal;
