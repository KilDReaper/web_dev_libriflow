import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeToggle from '@/app/public/_components/ThemeToogle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });

  it('starts with system title by default', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute('title', 'Theme: System');
    });
  });

  it('applies light theme for system when prefers dark is false', async () => {
    render(<ThemeToggle />);
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('cycles from system to dark on first click', async () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute('title', 'Theme: Dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('cycles from dark to light on second click', async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });

    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('title', 'Theme: Light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('cycles from light back to system on third click', async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('title', 'Theme: System');
    });
  });

  it('stores selected theme in localStorage', async () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  it('loads dark theme from localStorage on mount', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute('title', 'Theme: Dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('loads light theme from localStorage on mount', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute('title', 'Theme: Light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('applies dark for system when prefers dark is true', async () => {
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
