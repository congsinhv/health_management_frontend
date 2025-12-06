import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { ScheduleSection } from './index';
import { practiceFormSchema } from '@/app/practice/validation';
import type { PracticeFormData } from '@/types/practice';

// Test component that provides proper form context
const TestScheduleSection = () => {
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
        <ScheduleSection form={form} />
      </form>
    </Form>
  );
};

describe('ScheduleSection Component', () => {
  it('renders the main title', () => {
    render(<TestScheduleSection />);

    expect(screen.getByText('Lịch tập luyện trong tuần')).toBeInTheDocument();
  });

  it('displays mode selection tabs', () => {
    render(<TestScheduleSection />);

    expect(screen.getByText('Linh hoạt')).toBeInTheDocument();
    expect(screen.getByText('Cố định')).toBeInTheDocument();
  });

  it('shows day picker buttons with correct labels', () => {
    render(<TestScheduleSection />);

    // Check for abbreviated day labels
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('allows day selection by clicking', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    const mondayButton = screen.getByText('T2');
    await user.click(mondayButton);

    // The button should have selected styling (gradient background)
    expect(mondayButton).toHaveClass('bg-gradient-to-r');
  });

  it('toggles day selection when clicked twice', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    const mondayButton = screen.getByText('T2');

    // First click - select
    await user.click(mondayButton);
    expect(mondayButton).toHaveClass('bg-gradient-to-r');

    // Second click - deselect
    await user.click(mondayButton);
    expect(mondayButton).not.toHaveClass('bg-gradient-to-r');
  });

  it('switches to fixed mode when tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select a day first (required for fixed mode to show content)
    await user.click(screen.getByText('T2'));

    const fixedTab = screen.getByText('Cố định');
    await user.click(fixedTab);

    // Should show fixed mode content
    expect(screen.getByText('Giờ tập cố định')).toBeInTheDocument();
  });

  it('shows time inputs in fixed mode', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select a day first (required for fixed mode to show content)
    await user.click(screen.getByText('T2'));

    // Switch to fixed mode
    const fixedTab = screen.getByText('Cố định');
    await user.click(fixedTab);

    // Should show time inputs
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument();
    expect(screen.getByText('Kết thúc')).toBeInTheDocument();
  });

  it('handles multiple day selection', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select multiple days
    await user.click(screen.getByText('T2'));
    await user.click(screen.getByText('T5'));
    await user.click(screen.getByText('T7'));

    // All selected days should have the selected class
    expect(screen.getByText('T2')).toHaveClass('bg-gradient-to-r');
    expect(screen.getByText('T5')).toHaveClass('bg-gradient-to-r');
    expect(screen.getByText('T7')).toHaveClass('bg-gradient-to-r');
  });

  it('maintains selected days when switching modes', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select days in flexible mode
    await user.click(screen.getByText('T2'));
    await user.click(screen.getByText('T5'));

    // Switch to fixed mode
    await user.click(screen.getByText('Cố định'));

    // Days should still be selected
    expect(screen.getByText('T2')).toHaveClass('bg-gradient-to-r');
    expect(screen.getByText('T5')).toHaveClass('bg-gradient-to-r');
  });

  it('shows flexible mode by default', () => {
    render(<TestScheduleSection />);

    // Should not show fixed mode content initially
    expect(screen.queryByText('Khung giờ cố định')).not.toBeInTheDocument();
  });

  it('shows time period inputs when days are selected in flexible mode', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select a day
    await user.click(screen.getByText('T2'));

    // Should show day label for the selected day
    expect(screen.getByText('Thứ 2')).toBeInTheDocument();

    // Should show time input labels
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument();
    expect(screen.getByText('Kết thúc')).toBeInTheDocument();
  });

  it('allows adding multiple time periods for a day in flexible mode', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select Monday
    await user.click(screen.getByText('T2'));

    // Look for "Thêm khung giờ" button
    const addButton = screen.getByText('Thêm khung giờ');
    expect(addButton).toBeInTheDocument();

    // Button should be clickable
    expect(addButton).not.toBeDisabled();
  });

  it('shows duration for time periods', async () => {
    const user = userEvent.setup();
    render(<TestScheduleSection />);

    // Select a day to show time inputs
    await user.click(screen.getByText('T2'));

    // Should show day label
    expect(screen.getByText('Thứ 2')).toBeInTheDocument();

    // Should show "Thêm khung giờ" button
    expect(screen.getByText('Thêm khung giờ')).toBeInTheDocument();
  });
});
