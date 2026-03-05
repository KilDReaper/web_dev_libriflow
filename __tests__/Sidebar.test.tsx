import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '@/app/_components/Sidebar';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('Sidebar', () => {
  beforeEach(() => {
    pushMock.mockClear();
    localStorage.clear();
  });

  it('renders app name and username', () => {
    render(<Sidebar user={{ username: 'aayam' }} />);
    expect(screen.getByText('LibriFlow')).toBeInTheDocument();
    expect(screen.getByText('aayam')).toBeInTheDocument();
  });

  it('renders Guest when user is missing', () => {
    render(<Sidebar user={null} />);
    expect(screen.getByText('Guest')).toBeInTheDocument();
  });

  it('renders all menu labels', () => {
    render(<Sidebar user={{ username: 'user' }} />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('My Borrowed Books')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders correct link destinations', () => {
    render(<Sidebar user={{ username: 'user' }} />);
    expect(screen.getByRole('link', { name: /Library/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Search/ })).toHaveAttribute('href', '/search');
    expect(screen.getByRole('link', { name: /Recommendations/ })).toHaveAttribute('href', '/recommendations');
    expect(screen.getByRole('link', { name: /My Borrowed Books/ })).toHaveAttribute('href', '/borrowed-books');
    expect(screen.getByRole('link', { name: /Profile/ })).toHaveAttribute('href', '/user/profile');
  });

  it('opens mobile overlay when toggle button is clicked', () => {
    const { container } = render(<Sidebar user={{ username: 'user' }} />);
    const toggleButton = container.querySelector('button.fixed.top-4.left-4');
    expect(screen.queryByText('Logout')).toBeInTheDocument();
    expect(container.querySelector('div.fixed.inset-0')).not.toBeInTheDocument();

    fireEvent.click(toggleButton as Element);

    expect(container.querySelector('div.fixed.inset-0')).toBeInTheDocument();
  });

  it('closes mobile overlay when overlay is clicked', () => {
    const { container } = render(<Sidebar user={{ username: 'user' }} />);
    const toggleButton = container.querySelector('button.fixed.top-4.left-4');
    fireEvent.click(toggleButton as Element);

    const overlay = container.querySelector('div.fixed.inset-0');
    fireEvent.click(overlay as Element);

    expect(container.querySelector('div.fixed.inset-0')).not.toBeInTheDocument();
  });

  it('closes mobile overlay when a nav item is clicked', () => {
    const { container } = render(<Sidebar user={{ username: 'user' }} />);
    const toggleButton = container.querySelector('button.fixed.top-4.left-4');
    fireEvent.click(toggleButton as Element);

    fireEvent.click(screen.getByRole('link', { name: /Search/ }));

    expect(container.querySelector('div.fixed.inset-0')).not.toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Sidebar user={{ username: 'user' }} />);
    expect(screen.getByRole('button', { name: /Logout/ })).toBeInTheDocument();
  });

  it('removes token on logout', () => {
    localStorage.setItem('token', 'abc');
    render(<Sidebar user={{ username: 'user' }} />);

    fireEvent.click(screen.getByRole('button', { name: /Logout/ }));

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('redirects to login on logout', () => {
    render(<Sidebar user={{ username: 'user' }} />);

    fireEvent.click(screen.getByRole('button', { name: /Logout/ }));

    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('sidebar starts in closed mobile state', () => {
    const { container } = render(<Sidebar user={{ username: 'user' }} />);
    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('-translate-x-full');
  });

  it('sidebar opens in mobile state after toggle click', () => {
    const { container } = render(<Sidebar user={{ username: 'user' }} />);
    const toggleButton = container.querySelector('button.fixed.top-4.left-4');
    fireEvent.click(toggleButton as Element);

    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('translate-x-0');
  });
});
