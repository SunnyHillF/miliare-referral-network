import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Use guest access for registration page since user isn't signed in yet
const client = generateClient<Schema>({
  authMode: 'identityPool'
});

// Form validation schema - updated to match Cognito requirements
const registerSchema = z.object({
  // Required Cognito attributes
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+1[0-9]{10}$/, 'Phone number must be in format +1XXXXXXXXXX (e.g., +12345678901)'),
  address: z.string().min(5, 'Please enter your full address'),
  
  // Company selection
  companyId: z.string().min(1, 'Please select your company'),
  
  // Password requirements matching Cognito policy
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Array<{value: string, label: string}>>([]);
  const [selectedCompany, setSelectedCompany] = useState<Schema['Company']['type'] | null>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      companyId: '',
      password: '',
      confirmPassword: '',
    },
  });

  const companyId = watch('companyId');

  // Load companies from DynamoDB
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await client.models.Company.list({
          filter: { status: { eq: 'ACTIVE' } }
        });
        
        const companyOptions = (data || []).map(company => ({
          value: company.id || '',
          label: company.companyName || 'Unknown Company'
        }));
        
        setCompanies(companyOptions);
      } catch (error) {
        console.error('Failed to load companies:', error);
        toast.error('Failed to load companies', 'Please refresh the page');
      }
    };

    fetchCompanies();
  }, []);

  // Handle company selection
  useEffect(() => {
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.value === companyId);
      if (company) {
        // Find the full company data
        client.models.Company.get({ id: companyId })
          .then(({ data }) => {
            setSelectedCompany(data);
          })
          .catch(console.error);
      }
    }
  }, [companyId, companies]);

  const totalSteps = 3;

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof RegisterFormValues> = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phoneNumber', 'address'];
        break;
      case 2:
        fieldsToValidate = ['companyId'];
        break;
      default:
        break;
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Register user with proper Cognito attributes
      const completed = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        company: data.companyId, // This maps to custom:companyId in AuthContext
        activated: true, // Automatically activate new users
        password: data.password,
      });

      toast.success('Registration successful', 'Your account has been created!');
      
      if (completed) {
        navigate('/dashboard');
      } else {
        // Store password temporarily for auto-login after verification
        sessionStorage.setItem('tempPassword', data.password);
        toast.info('Check your email to verify your account');
        navigate('/verify', { state: { email: data.email } });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <div className="space-y-1">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+12345678901"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                onChange={(e) => {
                  // Auto-format phone number
                  let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                  if (value.length > 0 && !value.startsWith('1')) {
                    value = '1' + value; // Add country code if missing
                  }
                  if (value.length > 11) {
                    value = value.slice(0, 11); // Limit to 11 digits
                  }
                  const formattedValue = value.length > 0 ? '+' + value : '';
                  setValue('phoneNumber', formattedValue);
                }}
              />
              <p className="text-xs text-gray-500">
                Format: +1 followed by 10 digits (e.g., +12345678901)
              </p>
            </div>
            <Input
              label="Address"
              placeholder="Street address, city, state, ZIP"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            
            <Select
              label="Company"
              {...register('companyId')}
              options={companies}
              error={errors.companyId?.message}
            />

            {selectedCompany && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Selected Company</h3>
                <p className="text-sm text-blue-700">{selectedCompany.companyName}</p>
                <p className="text-xs text-blue-600">{selectedCompany.website}</p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Your team lead and organization lead will be assigned by your company administrator after registration.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Create Password</h2>
            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
              />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                </ul>
              </div>
            </div>
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> Your account will be automatically activated and ready to use once registration is complete.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Create Your Account</h1>
        <p className="mt-2 text-center text-gray-600">
          Join the Miliare Referral Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white p-8 shadow rounded-lg">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">
                Step {step} of {totalSteps}
              </div>
              <div className="text-sm font-medium text-primary">
                {Math.round((step / totalSteps) * 100)}% Complete
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
