import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SportsSection } from './index';
import { practiceFormSchema } from '@/app/practice/validation';
import type { PracticeFormData } from '@/types/practice';

// Mock the predefined sports data
vi.mock('@/app/practice/formHelper', () => ({
  predefinedSports: [
    { value: 'football', label: 'Bóng đá' },
    { value: 'basketball', label: 'Bóng rổ' },
    { value: 'swimming', label: 'Bơi lội' },
    { value: 'running', label: 'Chạy bộ' },
    { value: 'cycling', label: 'Đạp xe' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'gym', label: 'Gym' },
    { value: 'badminton', label: 'Cầu lông' },
  ],
}));

// Test component that provides proper form context
const TestSportsSection = () => {
  const form = useForm<PracticeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(practiceFormSchema) as any,
    defaultValues: {
      basicInfo: {
        targetWeight: 0,
      },
      schedule: {
        mode: 'flexible',
        selectedDays: [],
        flexiblePeriods: {},
        fixedPeriod: { startTime: '', endTime: '' },
      },
      sports: {
        predefined: [],
        custom: [],
      },
      notes: {
        personal: '',
        healthWarnings: '',
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <SportsSection form={form} />
      </form>
    </Form>
  );
};

describe('SportsSection Component', () => {
  it('renders the main title', () => {
    render(<TestSportsSection />);

    expect(screen.getByText('Môn thể thao yêu thích')).toBeInTheDocument();
  });

  it('displays the section description', () => {
    render(<TestSportsSection />);

    expect(screen.getByText('Sở thích')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Chọn các môn thể thao bạn yêu thích để cá nhân hóa đề xuất.'
      )
    ).toBeInTheDocument();
  });

  it('renders all predefined sports badges', () => {
    render(<TestSportsSection />);

    const sports = [
      'Bóng đá',
      'Bóng rổ',
      'Bơi lội',
      'Chạy bộ',
      'Đạp xe',
      'Yoga',
      'Gym',
      'Cầu lông',
    ];
    sports.forEach(sport => {
      expect(screen.getByText(sport)).toBeInTheDocument();
    });
  });

  it('allows selecting a predefined sport', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    const footballBadge = screen.getByText('Bóng đá');
    await user.click(footballBadge);

    // The badge should have selected styling
    expect(footballBadge).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
  });

  it('toggles predefined sport selection when clicked twice', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    const footballBadge = screen.getByText('Bóng đá');

    // First click - select
    await user.click(footballBadge);
    expect(footballBadge).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );

    // Second click - deselect
    await user.click(footballBadge);
    expect(footballBadge).not.toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
    expect(footballBadge).toHaveClass(
      'border-gray-300',
      'bg-white',
      'text-gray-700'
    );
  });

  it('allows selecting multiple predefined sports', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    await user.click(screen.getByText('Bóng đá'));
    await user.click(screen.getByText('Bơi lội'));
    await user.click(screen.getByText('Yoga'));

    expect(screen.getByText('Bóng đá')).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
    expect(screen.getByText('Bơi lội')).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
    expect(screen.getByText('Yoga')).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
  });

  it('renders custom sports input section', () => {
    render(<TestSportsSection />);

    expect(screen.getByText('Thêm môn thể thao khác')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Nhập môn thể thao khác...')
    ).toBeInTheDocument();
  });

  it('allows adding custom sports', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    const input = screen.getByPlaceholderText('Nhập môn thể thao khác...');
    const addButton = screen.getByRole('button', { name: /thêm/i });

    await user.type(input, 'Bóng chuyền');
    await user.click(addButton);

    // The custom sport should appear as a tag
    expect(screen.getByText('Bóng chuyền')).toBeInTheDocument();
  });

  it('allows removing custom sports', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    // Add a custom sport first
    const input = screen.getByPlaceholderText('Nhập môn thể thao khác...');
    const addButton = screen.getByRole('button', { name: /thêm/i });

    await user.type(input, 'Bóng chuyền');
    await user.click(addButton);

    // Remove the custom sport
    const removeButton = screen.getByRole('button', {
      name: /xóa bóng chuyền/i,
    });
    await user.click(removeButton);

    // The custom sport should be removed
    expect(screen.queryByText('Bóng chuyền')).not.toBeInTheDocument();
  });

  it('prevents adding empty custom sports', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    const addButton = screen.getByRole('button', { name: /thêm/i });
    await user.click(addButton);

    // No tag should be added
    expect(screen.queryAllByRole('button', { name: /xóa/i }).length).toBe(0);
  });

  it('allows adding multiple custom sports', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    const input = screen.getByPlaceholderText('Nhập môn thể thao khác...');
    const addButton = screen.getByRole('button', { name: /thêm/i });

    await user.type(input, 'Bóng chuyền');
    await user.click(addButton);

    await user.type(input, 'Bóng ném');
    await user.click(addButton);

    await user.type(input, 'Quần vợt');
    await user.click(addButton);

    expect(screen.getByText('Bóng chuyền')).toBeInTheDocument();
    expect(screen.getByText('Bóng ném')).toBeInTheDocument();
    expect(screen.getByText('Quần vợt')).toBeInTheDocument();
  });

  it('combines predefined and custom sports selection', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    // Select predefined sports
    await user.click(screen.getByText('Bóng đá'));
    await user.click(screen.getByText('Bơi lội'));

    // Add custom sports
    const input = screen.getByPlaceholderText('Nhập môn thể thao khác...');
    const addButton = screen.getByRole('button', { name: /thêm/i });

    await user.type(input, 'Bóng chuyền');
    await user.click(addButton);

    // All selections should be visible
    expect(screen.getByText('Bóng đá')).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
    expect(screen.getByText('Bơi lội')).toHaveClass(
      'border-primary',
      'bg-primary/10',
      'text-primary'
    );
    expect(screen.getByText('Bóng chuyền')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TestSportsSection />);

    // Check for proper ARIA labels
    const sportsGroup = screen.getByRole('group', {
      name: /chọn môn thể thao yêu thích/i,
    });
    expect(sportsGroup).toBeInTheDocument();

    // Check for proper button roles on badges
    const footballBadge = screen.getByText('Bóng đá');
    expect(footballBadge.tagName).toBe('BUTTON');
    expect(footballBadge).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates aria-pressed state when sport is selected', async () => {
    const user = userEvent.setup();
    render(<TestSportsSection />);

    const footballBadge = screen.getByText('Bóng đá');

    // Initially not pressed
    expect(footballBadge).toHaveAttribute('aria-pressed', 'false');

    // Select the sport
    await user.click(footballBadge);

    // Should be pressed
    expect(footballBadge).toHaveAttribute('aria-pressed', 'true');
  });
});
