import '@testing-library/jest-dom';
vi.mock('chart.js', () => {
  class FakeChart {
    static register = vi.fn();
  }
  return {
    Chart: FakeChart,
    CategoryScale: {},
    LinearScale: {},
    PointElement: {},
    LineElement: {},
    Tooltip: {},
    Legend: {},
  };
});
vi.mock('react-chartjs-2', () => ({ Line: () => null }));
vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn().mockRejectedValue({ name: 'UserUnAuthenticatedException' }),
  fetchAuthSession: vi.fn().mockResolvedValue({ tokens: undefined }),
}));
