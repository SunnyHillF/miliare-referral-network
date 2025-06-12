import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toaster';

const companies = [
  { value: 'WFG', label: 'WFG' },
  { value: 'Sunny Hill Financial', label: 'Sunny Hill Financial' },
  { value: 'Prime Corporate Services', label: 'Prime Corporate Services' },
  { value: 'ANCO', label: 'ANCO' },
  { value: 'Weightless Financial', label: 'Weightless Financial' },
  { value: 'Summit Business Syndicate', label: 'Summit Business Syndicate' },
  { value: 'Wellness for the Workforce', label: 'Wellness for the Workforce' },
  { value: 'Impact Health Sharing', label: 'Impact Health Sharing' },
  { value: 'Other', label: 'Other' },
];

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Please select your company'),
  uplineEVC: z.string().optional(),
  uplineSMD: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      company: user?.company || '',
      uplineEVC: user?.uplineEVC || '',
      uplineSMD: user?.uplineSMD || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const { company: _company, ...updates } = data;
    void _company;
    try {
      await updateProfile(updates);
      toast.success('Profile updated', 'Your changes have been saved.');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Update failed', 'Unable to update profile.');
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Select label="Company" options={companies} disabled {...register('company')} error={errors.company?.message} />
        <Input label="Upline EVC" {...register('uplineEVC')} error={errors.uplineEVC?.message} />
        <Input label="Upline SMD" {...register('uplineSMD')} error={errors.uplineSMD?.message} />
        <div className="pt-4">
          <Button type="submit">Update Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
