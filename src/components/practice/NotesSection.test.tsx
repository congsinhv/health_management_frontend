import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { NotesSection } from './NotesSection';
import { practiceFormSchema } from '@/app/practice/validation';
import type { PracticeFormData } from '@/types/practice';

// Test component that provides proper form context
const TestNotesSection = () => {
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
        <NotesSection form={form} />
      </form>
    </Form>
  );
};

describe('NotesSection Component', () => {
  it('renders the main title with optional indicator', () => {
    render(<TestNotesSection />);

    expect(screen.getByText('Ghi chú & Cảnh báo sức khỏe')).toBeInTheDocument();
    expect(screen.getByText('(Tùy chọn)')).toBeInTheDocument();
  });

  it('displays the section description', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    // Expand the section first
    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    expect(screen.getByText('Thông tin thêm')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Thêm ghi chú hoặc cảnh báo sức khỏe để chúng tôi điều chỉnh chương trình phù hợp.'
      )
    ).toBeInTheDocument();
  });

  it('is collapsible by default', () => {
    render(<TestNotesSection />);

    // Should have collapsible trigger
    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    expect(trigger).toBeInTheDocument();

    // Content should not be visible initially
    expect(screen.queryByText('Ghi chú riêng')).not.toBeInTheDocument();
    expect(screen.queryByText('Cảnh báo sức khỏe')).not.toBeInTheDocument();
  });

  it('expands when clicked', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    // Content should be visible after expansion
    expect(screen.getByText('Ghi chú riêng')).toBeInTheDocument();
    expect(screen.getByText('Cảnh báo sức khỏe')).toBeInTheDocument();
  });

  it('shows chevron down icon when collapsed', () => {
    render(<TestNotesSection />);

    expect(screen.getByText('Ghi chú & Cảnh báo sức khỏe')).toBeInTheDocument();
    const chevron = document.querySelector('.lucide-chevron-down');
    expect(chevron).toBeInTheDocument();
  });

  it('shows chevron up icon when expanded', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const chevron = document.querySelector('.lucide-chevron-up');
    expect(chevron).toBeInTheDocument();
  });

  it('renders personal notes textarea', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const personalNotes = screen.getByPlaceholderText(
      'VD: Tập nhẹ vào buổi sáng, không tập sau 9h tối...'
    );
    expect(personalNotes).toBeInTheDocument();
  });

  it('renders health warnings textarea', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );
    expect(healthWarnings).toBeInTheDocument();
  });

  it('allows typing in personal notes', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const personalNotes = screen.getByPlaceholderText(
      'VD: Tập nhẹ vào buổi sáng, không tập sau 9h tối...'
    );
    await user.type(personalNotes, 'Tôi thích tập vào buổi sáng');

    expect(personalNotes).toHaveValue('Tôi thích tập vào buổi sáng');
  });

  it('allows typing in health warnings', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );
    await user.type(healthWarnings, 'Đau lưng khi tập nặng');

    expect(healthWarnings).toHaveValue('Đau lưng khi tập nặng');
  });

  it('shows character counter for personal notes', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const personalNotes = screen.getByLabelText('Ghi chú riêng');
    await user.type(personalNotes, 'Hello');

    expect(screen.getByText('5/500')).toBeInTheDocument();
  });

  it('shows character counter for health warnings', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );
    await user.type(healthWarnings, 'Warning text');

    expect(screen.getByText('12/500')).toBeInTheDocument();
  });

  it('has 500 character limit for personal notes', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const personalNotes = screen.getByLabelText('Ghi chú riêng');
    expect(personalNotes).toHaveAttribute('maxlength', '500');
  });

  it('has 500 character limit for health warnings', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );
    expect(healthWarnings).toHaveAttribute('maxlength', '500');
  });

  it('applies special styling to health warnings when filled', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );
    await user.type(healthWarnings, 'Cao huyết áp');

    // Health warnings textarea should have amber border when filled
    expect(healthWarnings.parentElement?.parentElement).toHaveClass(
      'border-amber-400'
    );
  });

  it('does not apply special styling to health warnings when empty', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );

    // Health warnings textarea should not have amber border when empty
    expect(healthWarnings.parentElement?.parentElement).not.toHaveClass(
      'border-amber-400'
    );
  });

  it('has proper grid layout for textareas', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const contentContainer =
      screen.getByText('Ghi chú riêng').parentElement?.parentElement
        ?.parentElement;
    expect(contentContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2'
    );
  });

  it('has non-resizable textareas', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const personalNotes = screen.getByLabelText('Ghi chú riêng');
    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );

    expect(personalNotes).toHaveClass('resize-none');
    expect(healthWarnings).toHaveClass('resize-none');
  });

  it('has minimum height for textareas', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });
    await user.click(trigger);

    const personalNotes = screen.getByLabelText('Ghi chú riêng');
    const healthWarnings = screen.getByPlaceholderText(
      'VD: Đau khớp gối, huyết áp cao, dị ứng...'
    );

    expect(personalNotes).toHaveClass('min-h-[100px]');
    expect(healthWarnings).toHaveClass('min-h-[100px]');
  });

  it('maintains state when collapsed and expanded', async () => {
    const user = userEvent.setup();
    render(<TestNotesSection />);

    const trigger = screen.getByRole('button', {
      name: /ghi chú & cảnh báo sức khỏe/i,
    });

    // Expand
    await user.click(trigger);

    // Type something
    const personalNotes = screen.getByLabelText('Ghi chú riêng');
    await user.type(personalNotes, 'Test content');

    // Collapse
    await user.click(trigger);

    // Expand again
    await user.click(trigger);

    // Content should still be there
    expect(screen.getByLabelText('Ghi chú riêng')).toHaveValue('Test content');
  });
});
