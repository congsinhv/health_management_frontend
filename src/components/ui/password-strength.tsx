import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: 'Ít nhất 8 ký tự',
    test: password => password.length >= 8,
  },
  {
    label: 'Chứa chữ thường',
    test: password => /[a-z]/.test(password),
  },
  {
    label: 'Chứa chữ hoa',
    test: password => /[A-Z]/.test(password),
  },
  {
    label: 'Chứa số',
    test: password => /\d/.test(password),
  },
];

function calculateStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  const score = requirements.reduce((acc, req) => {
    return acc + (req.test(password) ? 1 : 0);
  }, 0);

  if (score === 0) return { score, label: 'Rất yếu', color: 'bg-red-500' };
  if (score === 1) return { score, label: 'Yếu', color: 'bg-red-400' };
  if (score === 2)
    return { score, label: 'Trung bình', color: 'bg-yellow-500' };
  if (score === 3) return { score, label: 'Tốt', color: 'bg-yellow-400' };
  return { score, label: 'Mạnh', color: 'bg-green-500' };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = calculateStrength(password);

  return (
    <div className='space-y-3'>
      {/* Strength Bar */}
      <div className='space-y-2'>
        <div className='flex justify-between text-[0.85rem]'>
          <span className='text-gray-600 dark:text-gray-400'>
            Độ mạnh mật khẩu
          </span>
          <span
            className={`font-medium ${
              strength.score <= 1
                ? 'text-red-600'
                : strength.score <= 3
                  ? 'text-yellow-600'
                  : 'text-green-600'
            }`}
          >
            {strength.label}
          </span>
        </div>
        <div className='h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className='space-y-1'>
        {requirements.map((requirement, index) => {
          const isValid = requirement.test(password);
          return (
            <div
              key={index}
              className={`flex items-center space-x-2 text-[0.85rem] transition-colors ${
                isValid
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {isValid ? (
                <Check className='h-3 w-3' />
              ) : (
                <X className='h-3 w-3' />
              )}
              <span>{requirement.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
