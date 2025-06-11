import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import DashboardLayout from '../layouts/DashboardLayout';
import * as AuthContext from '../contexts/AuthContext';
import { invitePartnerAdmin } from '../utils/invitePartnerAdmin';

// eslint-disable-next-line no-var
var mockCreate: vi.Mock;
vi.mock('aws-amplify/data', () => {
  mockCreate = vi.fn();
  return {
    generateClient: vi.fn(() => ({
      models: { Partner: { create: mockCreate } },
    })),
  };
});
vi.mock('../utils/invitePartnerAdmin', () => ({ invitePartnerAdmin: vi.fn() }));

const baseAuth = {
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
};

type UseAuthReturn = ReturnType<typeof AuthContext.useAuth>;

vi.stubEnv('VITE_COGNITO_USER_POOL_ID', 'testpool');
describe('Partner creation access', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('hides create partner link for partner admins', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: { id: '1', firstName: 'Partner', lastName: 'Admin', email: 'p@example.com', company: 'WFG', groups: ['partnerAdmin'] },
    } as UseAuthReturn);

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    expect(screen.queryByText(/create partner/i)).not.toBeInTheDocument();
  });

  it('restricts new partner route to admins', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: { id: '2', firstName: 'User', lastName: 'A', email: 'u@example.com', company: 'WFG', groups: [] },
    } as UseAuthReturn);

    render(
      <MemoryRouter initialEntries={["/dashboard/company-admin/new-partner"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText(/create partner/i)).not.toBeInTheDocument();
    expect(screen.getByText(/your business dashboard/i)).toBeInTheDocument();
  });

  it('creates partner and invites admin', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: { id: '1', firstName: 'Admin', lastName: 'Root', email: 'admin@example.com', company: 'WFG', groups: ['admin'] },
    } as UseAuthReturn);

    mockCreate.mockResolvedValue({ id: '123' });

    render(
      <MemoryRouter initialEntries={["/dashboard/company-admin/new-partner"]}>
        <App />
      </MemoryRouter>
    );

    fireEvent.change(await screen.findByLabelText(/partner name/i), { target: { value: 'NewCo' } });
    fireEvent.change(await screen.findByLabelText(/contact email/i), { target: { value: 'c@example.com' } });
    fireEvent.change(await screen.findByLabelText(/website/i), { target: { value: 'https://new.co' } });
    fireEvent.change(await screen.findByLabelText(/admin email/i), { target: { value: 'admin@new.co' } });

    fireEvent.click(screen.getByRole('button', { name: /create partner/i }));

    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
    expect(invitePartnerAdmin).toHaveBeenCalled();
  });
});
