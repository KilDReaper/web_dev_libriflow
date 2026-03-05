import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page';
import api from '@/lib/api';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/app/_components/AdminDashboardContent', () => {
  return function MockAdminDashboardContent() {
    return <div data-testid="admin-dashboard">Admin Dashboard Content</div>;
  };
});

jest.mock('@/app/_components/LibraryContent', () => {
  return function MockLibraryContent() {
    return <div data-testid="library-content">Library Content</div>;
  };
});

jest.mock('@/app/_components/Sidebar', () => {
  return function MockSidebar({ user }: any) {
    return <div data-testid="sidebar">Sidebar for {user?.username ?? 'Guest'}</div>;
  };
});

describe('HomePage', () => {
  const mockedGet = api.get as jest.Mock;

  beforeEach(() => {
    mockedGet.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('shows loading state before profile resolves', () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    render(<HomePage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calls profile endpoint on mount', async () => {
    mockedGet.mockResolvedValue({ data: { data: { role: 'user', username: 'demo' } } });

    render(<HomePage />);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('/auth/profile');
    });
  });

  it('renders admin dashboard for admin user', async () => {
    mockedGet.mockResolvedValue({ data: { data: { role: 'admin', username: 'adminUser' } } });

    render(<HomePage />);

    expect(await screen.findByTestId('admin-dashboard')).toBeInTheDocument();
  });

  it('renders sidebar and library for regular user', async () => {
    mockedGet.mockResolvedValue({ data: { data: { role: 'user', username: 'reader' } } });

    render(<HomePage />);

    expect(await screen.findByTestId('sidebar')).toHaveTextContent('reader');
    expect(screen.getByTestId('library-content')).toBeInTheDocument();
  });

  it('renders guest sidebar when profile request fails', async () => {
    mockedGet.mockRejectedValue(new Error('network error'));

    render(<HomePage />);

    expect(await screen.findByTestId('sidebar')).toHaveTextContent('Guest');
    expect(screen.getByTestId('library-content')).toBeInTheDocument();
  });

  it('does not render admin dashboard for non-admin users', async () => {
    mockedGet.mockResolvedValue({ data: { data: { role: 'user', username: 'reader' } } });

    render(<HomePage />);

    await screen.findByTestId('sidebar');
    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument();
  });

  it('removes loading state after success', async () => {
    mockedGet.mockResolvedValue({ data: { data: { role: 'user', username: 'reader' } } });

    render(<HomePage />);

    await screen.findByTestId('sidebar');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('removes loading state after error', async () => {
    mockedGet.mockRejectedValue(new Error('network error'));

    render(<HomePage />);

    await screen.findByTestId('sidebar');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
