import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toaster';
import { inviteCompanyAdmin } from '../../utils/inviteCompanyAdmin';

const client = generateClient<Schema>();

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await client.models.Company.list();
        setCompanies(data || []);
      } catch (error) {
        console.error('Failed to load companies', error);
        toast.error('Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      // Create company with proper schema fields
      const { data: company } = await client.models.Company.create({
        companyName: data.companyName,
        contactEmail: data.contactEmail,
        website: data.website,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (company) {
        setCompanies((prev) => [...prev, company]);

        // Invite company admin
        await inviteCompanyAdmin({
          email: data.adminEmail,
          firstName: data.adminFirstName,
          lastName: data.adminLastName,
          companyId: company.id || '',
        });

        toast.success('Company created successfully', 'Invitation sent to company admin');
        reset(); // Clear the form
      }
    } catch (err) {
      console.error('Error creating company:', err);
      toast.error('Failed to create company', 'Please try again');
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
          <Input label="Company Name" {...register('companyName')} error={errors.companyName?.message} />
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
          <div className="space-y-3">
            {companies.map((company) => (
              <div key={company.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{company.companyName}</h3>
                  <p className="text-sm text-gray-600">{company.contactEmail}</p>
                  <p className="text-xs text-gray-500">{company.website}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    company.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {company.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
