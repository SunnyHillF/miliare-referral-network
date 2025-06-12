import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toaster';
import { inviteCompanyAdmin } from '../../utils/inviteCompanyAdmin';

const client = generateClient<Schema>();

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  contactEmail: z.string().email('Valid email required'),
  website: z.string().url('Valid URL required'),
  adminFirstName: z.string().min(1, 'First name required'),
  adminLastName: z.string().min(1, 'Last name required'),
  adminEmail: z.string().email('Valid email required'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

const AdminPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Schema['Company']['type'][]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await client.models.Company.list();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to load companies', error);
      }
    };
    fetchCompanies();
  }, []);

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: company } = await client.models.Company.create({
        name: data.name,
        contactEmail: data.contactEmail,
        website: data.website,
        status: 'ACTIVE',
      });

      setCompanies((prev) => [...prev, company]);

      await inviteCompanyAdmin({
        email: data.adminEmail,
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        companyId: company.id,
      });

      toast.success('Company created', 'Invitation sent to company admin');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create company');
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
        <h2 className="text-xl font-semibold mb-4">Create New Company</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Company Name" {...register('name')} error={errors.name?.message} />
          <Input label="Contact Email" {...register('contactEmail')} error={errors.contactEmail?.message} />
          <Input label="Website" {...register('website')} error={errors.website?.message} />
          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Admin First Name" {...register('adminFirstName')} error={errors.adminFirstName?.message} />
            <Input label="Admin Last Name" {...register('adminLastName')} error={errors.adminLastName?.message} />
          </div>
          <Input label="Admin Email" {...register('adminEmail')} error={errors.adminEmail?.message} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Company'}
          </Button>
        </form>
      </div>

      {companies.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Existing Companies</h2>
          <ul className="space-y-2">
            {companies.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="text-sm text-gray-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
