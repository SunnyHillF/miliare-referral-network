import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toaster';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
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
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
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
        <Input label="Email" disabled type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone Number" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
        <Input label="Address" {...register('address')} error={errors.address?.message} />
        <div className="pt-4">
          <Button type="submit">Update Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
