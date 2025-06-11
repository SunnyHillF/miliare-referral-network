import React from 'react';
import { useForm } from 'react-hook-form';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { invitePartnerAdmin } from '../../utils/invitePartnerAdmin';

interface FormValues {
  name: string;
  contactEmail: string;
  website: string;
  description: string;
  adminEmail: string;
}

const client = generateClient<Schema>();
const userPoolId =
  (import.meta.env as { VITE_COGNITO_USER_POOL_ID?: string }).VITE_COGNITO_USER_POOL_ID ||
  process.env.VITE_COGNITO_USER_POOL_ID ||
  '';

const CreatePartnerPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const partner = await client.models.Partner.create({
      name: data.name,
      contactEmail: data.contactEmail,
      website: data.website,
      description: data.description,
    });

    await invitePartnerAdmin(userPoolId, data.adminEmail, partner.id);

    navigate(`/dashboard/company-admin/partner-created/${partner.id}`);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Create Partner</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Partner Name" {...register('name', { required: true })} error={errors.name && 'Required'} />
        <Input label="Contact Email" type="email" {...register('contactEmail', { required: true })} error={errors.contactEmail && 'Required'} />
        <Input label="Website" {...register('website', { required: true })} error={errors.website && 'Required'} />
        <Input label="Description" {...register('description')} />
        <Input label="Admin Email" type="email" {...register('adminEmail', { required: true })} error={errors.adminEmail && 'Required'} />
        <Button type="submit">Create Partner</Button>
      </form>
    </div>
  );
};

export default CreatePartnerPage;
