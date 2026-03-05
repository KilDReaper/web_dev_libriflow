import { fireEvent, render, screen } from '@testing-library/react';
import Header from '@/app/public/_components/Header';

let pathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: () => pathname,
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

jest.mock('@/app/public/_components/ThemeToogle', () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  };
});

describe('Header', () => {
  beforeEach(() => {
    pathname = '/';
  });

  it('renders logo text', () => {
    render(<Header />);
    expect(screen.getByText('MyApp')).toBeInTheDocument();
  });

  it('renders home and about navigation links', () => {
    render(<Header />);
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    const aboutLinks = screen.getAllByRole('link', { name: 'About' });

    expect(homeLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('renders auth links', () => {
    render(<Header />);
    expect(screen.getAllByRole('link', { name: 'Log in' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Sign up' }).length).toBeGreaterThan(0);
  });

  it('sets home link active class on root path', () => {
    render(<Header />);
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    expect(homeLinks.some((link) => link.className.includes('text-foreground'))).toBe(true);
  });

  it('sets about link active class on about subpath', () => {
    pathname = '/about/team';
    render(<Header />);
    const aboutLinks = screen.getAllByRole('link', { name: 'About' });
    expect(aboutLinks.some((link) => link.className.includes('text-foreground'))).toBe(true);
  });

  it('renders mocked theme toggle', () => {
    render(<Header />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('mobile menu starts closed', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens mobile menu when toggled', () => {
    render(<Header />);
    const toggleButton = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes mobile menu when toggled twice', () => {
    render(<Header />);
    const toggleButton = screen.getByRole('button', { name: 'Toggle menu' });

    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes mobile menu after clicking mobile nav link', () => {
    render(<Header />);
    const toggleButton = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(toggleButton);

    const mobileHomeLink = screen.getAllByRole('link', { name: 'Home' })[1];
    fireEvent.click(mobileHomeLink);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });
});
