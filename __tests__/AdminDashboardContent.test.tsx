import { render, screen } from '@testing-library/react';
import AdminDashboardContent from '@/app/_components/AdminDashboardContent';

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('AdminDashboardContent', () => {
  it('renders page heading and subtitle', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Manage your library system')).toBeInTheDocument();
  });

  it('renders all admin action cards', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByText('Book Inventory')).toBeInTheDocument();
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    expect(screen.getByText('Borrowed Books')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Go to Library')).toBeInTheDocument();
    expect(screen.getByText('Search Books')).toBeInTheDocument();
  });

  it('renders inventory link path', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('link', { name: /Book Inventory/ })).toHaveAttribute('href', '/admin/books');
  });

  it('renders add book link path', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('link', { name: /Add New Book/ })).toHaveAttribute('href', '/admin/books/create');
  });

  it('renders borrowed books link path', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('link', { name: /Borrowed Books/ })).toHaveAttribute('href', '/admin/borrowed-books');
  });

  it('renders users link path', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('link', { name: /User Management/ })).toHaveAttribute('href', '/admin/users');
  });

  it('renders library link path', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('link', { name: /Go to Library/ })).toHaveAttribute('href', '/library');
  });

  it('renders search link path', () => {
    render(<AdminDashboardContent />);
    expect(screen.getByRole('link', { name: /Search Books/ })).toHaveAttribute('href', '/search');
  });

  it('shows default stat labels', async () => {
    render(<AdminDashboardContent />);
    expect(await screen.findByText('Total Books')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Borrowed')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('shows zero values for default stats', async () => {
    render(<AdminDashboardContent />);
    await screen.findByText('Total Books');
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });
});
