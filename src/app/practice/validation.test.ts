import { describe, it, expect } from 'vitest';
import { validateTargetWeight } from './validation';

describe('validateTargetWeight', () => {
  describe('Goal: gain', () => {
    it('returns true when target weight is greater than current weight', () => {
      const result = validateTargetWeight(70, 65, 'gain');
      expect(result).toBe(true);
    });

    it('returns error message when target weight is equal to current weight', () => {
      const result = validateTargetWeight(65, 65, 'gain');
      expect(result).toBe(
        'Mục tiêu tăng cân: cân nặng mục tiêu phải lớn hơn cân nặng hiện tại'
      );
    });

    it('returns error message when target weight is less than current weight', () => {
      const result = validateTargetWeight(60, 65, 'gain');
      expect(result).toBe(
        'Mục tiêu tăng cân: cân nặng mục tiêu phải lớn hơn cân nặng hiện tại'
      );
    });
  });

  describe('Goal: lose', () => {
    it('returns true when target weight is less than current weight', () => {
      const result = validateTargetWeight(60, 65, 'lose');
      expect(result).toBe(true);
    });

    it('returns error message when target weight is equal to current weight', () => {
      const result = validateTargetWeight(65, 65, 'lose');
      expect(result).toBe(
        'Mục tiêu giảm cân: cân nặng mục tiêu phải nhỏ hơn cân nặng hiện tại'
      );
    });

    it('returns error message when target weight is greater than current weight', () => {
      const result = validateTargetWeight(70, 65, 'lose');
      expect(result).toBe(
        'Mục tiêu giảm cân: cân nặng mục tiêu phải nhỏ hơn cân nặng hiện tại'
      );
    });
  });

  describe('Goal: maintain', () => {
    it('returns true when target weight is within 1kg of current weight', () => {
      const result = validateTargetWeight(65, 65, 'maintain');
      expect(result).toBe(true);
    });

    it('returns true when target weight is 1kg less than current weight', () => {
      const result = validateTargetWeight(64, 65, 'maintain');
      expect(result).toBe(true);
    });

    it('returns true when target weight is 1kg more than current weight', () => {
      const result = validateTargetWeight(66, 65, 'maintain');
      expect(result).toBe(true);
    });

    it('returns error message when target weight is more than 1kg different', () => {
      const result = validateTargetWeight(63, 65, 'maintain');
      expect(result).toBe(
        'Mục tiêu giữ cân: cân nặng mục tiêu phải xấp xỉ cân nặng hiện tại (±1kg)'
      );
    });

    it('returns error message when target weight is more than 1kg higher', () => {
      const result = validateTargetWeight(67, 65, 'maintain');
      expect(result).toBe(
        'Mục tiêu giữ cân: cân nặng mục tiêu phải xấp xỉ cân nặng hiện tại (±1kg)'
      );
    });
  });

  describe('Edge cases', () => {
    it('returns true for unknown goal', () => {
      const result = validateTargetWeight(70, 65, 'unknown');
      expect(result).toBe(true);
    });

    it('handles decimal weights correctly', () => {
      const result = validateTargetWeight(65.5, 65.2, 'gain');
      expect(result).toBe(true);
    });

    it('handles very small weight differences', () => {
      const result = validateTargetWeight(65.01, 65, 'maintain');
      expect(result).toBe(true);
    });

    it('handles zero weight difference for maintain', () => {
      const result = validateTargetWeight(65.0, 65.0, 'maintain');
      expect(result).toBe(true);
    });
  });
});
