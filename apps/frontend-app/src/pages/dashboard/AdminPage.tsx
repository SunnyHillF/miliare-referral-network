import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toaster';
import { invitePartnerAdmin } from '../../utils/invitePartnerAdmin';

const client = generateClient<Schema>();

const partnerSchema = z.object({
  name: z.string().min(1, 'Partner name is required'),
  contactEmail: z.string().email('Valid email required'),
  website: z.string().url('Valid URL required'),
  adminFirstName: z.string().min(1, 'First name required'),
  adminLastName: z.string().min(1, 'Last name required'),
  adminEmail: z.string().email('Valid email required'),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

const AdminPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
  });

  const onSubmit = async (data: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: partner } = await client.models.Partner.create({
        name: data.name,
        contactEmail: data.contactEmail,
        website: data.website,
        status: 'ACTIVE',
      });

      await invitePartnerAdmin({
        email: data.adminEmail,
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        partnerId: partner.id,
      });

      toast.success('Partner created', 'Invitation sent to partner admin');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrative tools and settings.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Create New Partner</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Partner Name" {...register('name')} error={errors.name?.message} />
          <Input label="Contact Email" {...register('contactEmail')} error={errors.contactEmail?.message} />
          <Input label="Website" {...register('website')} error={errors.website?.message} />
          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Admin First Name" {...register('adminFirstName')} error={errors.adminFirstName?.message} />
            <Input label="Admin Last Name" {...register('adminLastName')} error={errors.adminLastName?.message} />
          </div>
          <Input label="Admin Email" {...register('adminEmail')} error={errors.adminEmail?.message} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Partner'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
