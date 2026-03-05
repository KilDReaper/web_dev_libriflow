import { fireEvent, render, screen } from '@testing-library/react';
import BackButton from '@/app/_components/BackButton';

const backMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
  }),
}));

describe('BackButton', () => {
  beforeEach(() => {
    backMock.mockClear();
  });

  it('renders back button label', () => {
    render(<BackButton />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('calls router.back on click', () => {
    render(<BackButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<BackButton className="mb-4" />);
    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass('mb-4');
  });

  it('keeps base button style classes', () => {
    render(<BackButton />);
    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass('inline-flex');
    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass('rounded-lg');
  });
});
